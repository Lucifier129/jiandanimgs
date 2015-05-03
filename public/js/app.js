define(function(require, exports, module) {
    var $ = require('jquery')
    var app = {
    	init: function() {
            if ('ontouchstart' in document) {
                return
            }
    		this.listen()
    	},
        listen: function() {
            var that = this
            $('#content')
                .on('click', 'li', function() {
                	var index = $(this).attr('data-index')
                	that.selectImgByIndex(index)
                	$('body').css({
                		width: $("body").width(),
                		overflow: 'hidden'
                	})
                	$('#popWindow').show()
                	$('#imgArea').addClass('animated zoomIn')
                })

            $('#contextmenu')
                .on('click', '#next, #prev', function() {
                	var index = Number($('#imgArea').data('index'))
                    switch (this.id) {
                        case 'next':
                        	index += 1
                            break
                        case 'prev':
                        	index -= 1
                            break
                    }
                    console.log(this.id, index)
                     that.selectImgByIndex(index)
                }).on('mouseleave', function() {
                    $(this).hide()
                })

            $('#popWindow')
                .on('contextmenu', function(e) {
                    e.preventDefault()
                    $('#contextmenu').css({
                        top: e.pageY + $('#popWindow').scrollTop() - $('#popWindow').offset().top - 40,
                        left: e.pageX - 50
                    }).show()
                })
                .on('click', function(e) {
                    if (e.target.className === 'c-inner' || e.target.id === 'closer') {
                        $(this).hide()
                        $('#imgArea').removeClass('animated zoomIn')
                        $('body').css({
                        	width: 'auto',
                        	overflow: 'auto'
                        })
                    }
                })
        },
        selectImgByIndex: function(index) {
        	var total = $("#content li").length
        	if (index < 0) {
        		index += total
        	} else {
        		index = index % total
        	}
        	var selector = '#content [data-index="' + index + '"] img'
        	var $img = $(selector)
        	$('#imgArea img').attr('src', $img.attr('src'))
        	$('#imgArea').css({
        		left: 0,
        		top: 0
        	}).data('index', index)
        }
    }

    app.init()

})
