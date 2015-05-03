var superagent = require('superagent')
var cheerio = require('cheerio')
var path = require('path')
var Promise = require('es6-promise').Promise

function parse(resolve, reject, err, res) {
    if (err) {
        return reject(err)
    }
    var $ = cheerio.load(res.text)
    var pageId = Number($('.current-comment-page').eq(0).text().replace(/\[|\]/g, ''))
    var imgs = []
    var texts = []
    $('ol.commentlist .text').each(function(i1, text) {
        var o, x
        $(text).find('.vote span').each(function(i2, span) {
            var id = $(span).attr('id')
            if (!id) {
                return
            }
            if (id.indexOf('cos_support') >= 0) {
                o = +$(span).text()
            } else if (id.indexOf('cos_unsupport') >= 0) {
                x = +$(span).text()
            }
        })
        if (o / x > 5) {
            $(text).find('p img').each(function(i, img) {
                var src = $(img).attr('src');
                if (path.extname(src) !== '.gif') {
                    imgs.push(src)
                    texts.push(['点赞数:', o, ' 点踩数：', x].join(''))
                }
            })
        }
    })

    resolve({
        imgs: imgs,
        pageId: pageId,
        texts: texts
    })
}

function fetchImgs(url) {
    return new Promise(function(resolve, reject) {
        superagent
            .get(url)
            .end(parse.bind(null, resolve, reject))
    })
}

function range(num) {
    var ret = [{
        className: 'active',
        index: num
    }]
    for (var i = 1; i <= 5; i++) {
        if (num - 1 > 0) {
            ret.unshift({
                className: 'waves-effect',
                index: num - i
            })
        }
        ret.push({
            className: 'waves-effect',
            index: num + i
        })
    }
    return ret.map(function(item) {
        item.url = item.className === 'active' ? '#' : path.join('/', String(item.index))
        return item
    })
}

function convert(resource) {
    var result = {}
    var list = result.list = [
        [],
        [],
        [],
        []
    ]
    var texts = resource.texts
    resource.imgs.forEach(function(url, index) {
        list[index % 4].push({
            index: index,
            url: url,
            text: texts[index]
        })
    })
    result.pageTurning = range(resource.pageId)
    result.pageId = resource.pageId
    return result
}

function hanlde(req, res) {
    var target = 'jandan.net/ooxx/'
    if (req.params.page) {
        target = path.join(target, 'page-' + req.params.page)
    }
    fetchImgs(target)
        .then(convert)
        .then(res.render.bind(res, 'index'))
        .catch(function(err) {
            res.json({
                meta: {
                    error: true,
                    message: err
                },
                data: null
            })
        })
}

module.exports = hanlde
