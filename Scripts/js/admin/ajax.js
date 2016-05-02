
var Ajax = {
    requests: [],
    debug: false,
    onSend: function (e, jqXHR, options) {
        this.requests.push(jqXHR);
    },
    onComplete: function (e, jqXHR, options) {
        this.requests = $.grep(this.requests, function (x) { return x != jqXHR; });
    },
    call: function (url, data, type) {
        return $.ajax({
            type: type || 'GET',
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            timeout: 20000,
            success: $.proxy(this.success, this),
            error: $.proxy(this.error, this)
        });
    },
    get: function (url, data) {
        return this.call(url, data, 'GET');
    },
    post: function (url, data) {
        return this.call(url, data, 'POST');
    },
    abortAll: function () {
        for (var i = 0; i < this.requests.length; i++) {
            this.requests[i].abort();
            this.requests.splice(i, 1);
        }
    },
    success: function (res, status, jqXHR) {
        if (this.debug && console && console.log) {
            console.log(res);
        }
    },
    error: function (res, e, m) {
        if (this.debug && console && console.log) {
            console.log(e, m);
        }
    }
};