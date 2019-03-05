// ==UserScript==
// @name         Anti Boost.ink
// @version      1.0
// @description  Boost.ink meme
// @author       A200K
// @include      http://*.boost.ink/*
// @include      https://*.boost.ink/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Ghetto sleep function, thx js
    function sleep( millisecondsToWait )
    {
        var now = new Date().getTime();
        while ( new Date().getTime() < now + millisecondsToWait )
        {
        }
    }

    let confirmationList = [];

    // Obtain all links that have to be 'visited'
    let query_urls = [];
    let inputElements = document.getElementsByClassName("all_steps")[0].children;
    for (var i = 0; i < inputElements.length; i++)
    {
        let obj = inputElements[i];
        if( obj.href != null )
        {
            let target_url = obj.href;
            query_urls.push(target_url);
        }
    }

    // Edit document to show we are doing something
    document.getElementsByClassName("all_steps")[0].innerHTML = "Processing...";

    // Remove button
    let complete_btn = document.getElementsByClassName("complete_btn")[0];
    complete_btn.parentNode.removeChild(complete_btn);

    // Do requests for all urls that we want to 'visit'
    for( let i = 0; i < query_urls.length; i++ )
    {
        let target_url = query_urls[i];
        document.getElementsByClassName("all_steps")[0].innerHTML = 'Processing... (' + (i+1) + '/' + query_urls.length + ')';
        // Send Confirm, reply is empty
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/ajax/analytics', false);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send('click=' + target_url);

        sleep(2000);

        // We will receive some confirmation code
        xhr = new XMLHttpRequest();
        xhr.open('POST', '/ajax/analytics', false);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send('focus=true');
        confirmationList.push(xhr.responseText);
    }

    // Generate final request to obtain the hidden url
    var full_request_string = confirmationList.join('%');
    var link = window.location.pathname.substring(1);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/ajax/analytics', false);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('unlock=' + full_request_string + '&link=' + link);

    var hidden_url = xhr.responseText;
    console.log('Reply: ' + hidden_url);

    document.getElementsByClassName("all_steps")[0].innerHTML = '<a href="' + hidden_url + '" target="_blank">' + hidden_url + '</a>';
    // Redirect
    // window.location = hidden_url;

})();

