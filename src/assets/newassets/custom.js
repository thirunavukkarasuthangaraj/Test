$(document).ready(function() {
    $("#show_hide_password .view-password").on('click', function(event) {
        event.preventDefault();
        if($('#show_hide_password input').attr("type") == "text")
        {
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass( "bi-eye-slash-fill" );
            $('#show_hide_password i').removeClass( "bi-eye-fill" );
        }else if($('#show_hide_password input').attr("type") == "password")
        {
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass( "bi-eye-slash-fill" );
            $('#show_hide_password i').addClass( "bi-eye-fill" );
        }
    });
});


$(window).scroll(function () {

         // set distance user needs to scroll before we start fadeIn
    if ($(this).scrollTop() > 100) {
        $('.navbar').addClass("animation-top");
    } else{
        $('.navbar').removeClass("animation-top");
    }
});

