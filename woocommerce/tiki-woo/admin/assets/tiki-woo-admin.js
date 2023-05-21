(function ($) {
    'use strict';

    // enable color picker
    $('.color-picker').wpColorPicker();


    // on upload button click
    $('body').on('click', '.tiki-img-upload', function (event) {
        event.preventDefault();

        const button = $(this)
        const imageId = button.next().next().val();
        const customUploader = wp.media({
            title: 'Insert image', // modal window title
            library: {
                type: 'image'
            },
            button: {
                text: 'Use this image'
            },
            multiple: false
        }).on('select', function () {
            const attachment = customUploader.state().get('selection').first().toJSON();
            button.removeClass('button').html('<img style="max-width:150px;max-height:150px" src="' + attachment.url + '"><br />');
            button.next().next().show();
            button.next().next().val(attachment.id);
            button.blur()
        })

        // already selected images
        customUploader.on('open', function () {

            if (imageId) {
                const selection = customUploader.state().get('selection')
                let attachment = wp.media.attachment(imageId);
                attachment.fetch();
                selection.add(attachment ? [attachment] : []);
            }

        })

        customUploader.open()

    });
    // on remove button click
    $('body').on('click', '.tiki-img-remove', function (event) {
        event.preventDefault();
        const button = $(this);
        button.next().val('');
        button.hide().prev().prev().addClass('button').html('Upload image');
    });
})(jQuery);
