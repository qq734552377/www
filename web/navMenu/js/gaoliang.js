/**
 * Created by pj on 2017/2/24.
 */
$(function () {

    var http = window.location.href.split("/");

    var href = http[http.length - 1].substring(0, 4);
    //alert(href)
    //alert(http.join("    "));


    if (href) {
        $(".list li a[href^='" + href + "']").addClass("on");
    } else {
        $(".list li a[href^='gaoliang']").addClass("on");
    }

    // $.post("http://localhost/mydemo/returnjson.php", function (data) {
    //     var result = JSON.parse(data);
    //     console.log(result[2]);
    //     console.log(result[2].firstname);
    //     console.log(result[2].province==null)
    // });

    $.post( "http://localhost/mydemo/returnjson.php", { name: "John", time: "2pm" })
        .done(function( data ) {
            var result = JSON.parse(data);
            console.log(result);
            console.log(result[2]);
            console.log(result[2].firstname);
            console.log(result[2].province==null)
        });

})