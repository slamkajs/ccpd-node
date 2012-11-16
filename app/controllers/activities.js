var solr = require('../../data/solr_db');

// Activities Home
exports.index = function(req, res){
    var url_parse = req.url.split('?');
    var url = url_parse[0];
    var qs = url_parse[1];
    var page = 0;
    var startRecord = 1;
    var perPage = 10;

    if(qs && qs.length > 0) {
        qs = qs.split('&')
    }

    for(var curr in qs) {
        pair = qs[curr].split('=');

        switch(pair[0]) {
            case 'page':
                page = pair[1];
                startRecord = (pair[1]-1) * 10;
                break;

            case 'items':
                perPage = pair[1];
        }
    }

    if(startRecord <= 0) startRecord = 1;

    var solrQuery = solr.createQuery()
                                   .q({'*' : '*'})
                                   .start(startRecord)
                                   .rows(perPage);

    solr.search(solrQuery, function(err, ret) {
        var response = ret.response;
        var pagesToShow = 10;
        var pagingCounter = Math.round(startRecord/perPage)-(pagesToShow/2);

        var activities = {};
        activities.list = response.docs;
        activities.count = response.numFound.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var pager = {};
        pager.pages = [];
        pager.currentPage = page;
        pager.totalPages = Math.round(response.numFound/perPage);

        for(var counter = 1; counter < pagesToShow; counter++) {
            if(pagingCounter <= 0) pagingCounter = counter;

            if(pagingCounter <= Math.round(response.numFound/perPage)) {
                pager.pages.push(pagingCounter);
                pagingCounter++;
            }
        }

        res.render('activities/index', {
            title: 'Activities',
            url: url,
            activities: activities,
            pager: pager
        });
    });
}

// Activities Home
exports.search = function(req, res){
    var url_parse = req.url.split('?');
    var url = url_parse[0];
    var qs = url_parse[1];
    var page = 0;
    var startRecord = 1;
    var perPage = 10;
    var query = {'*' : '*'};

    if(qs && qs.length > 0) {
        qs = qs.split('&')
    }
    for(var curr in qs) {
        pair = qs[curr].split('=');

        switch(pair[0].toLowerCase()) {
            case 'items':
                perPage = pair[1];
                break;
                
            case 'page':
                page = pair[1];
                startRecord = (pair[1]-1) * 10;
                break;

            case 'q':
                query = pair[1];
                break;
        }
    }

    if(startRecord <= 0) startRecord = 1;

    var solrQuery = solr.createQuery()
                                   .q(query)
                                   .start(startRecord)
                                   .rows(perPage)
                                   .facet({'field':'title'})
                                   .facet({'field':'grouping'})
                                   .facet({'field':'session_type'})
                                   .facet({'field':'activity_type'});

    solr.search(solrQuery, function(err, ret) {
        var response = ret.response;
        var response_facets = ret.facet_counts.facet_fields;
        var pagesToShow = 10;

        var activities = {};
        activities.list = response.docs;
        activities.count = response.numFound.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var pager = {};
        pager.pages = [];
        pager.currentPage = page;
        pager.totalPages = Math.round(response.numFound/perPage);

        var pagingCounter = Math.round(startRecord/perPage)-(pagesToShow/2);

        for(var counter = 1; counter < pagesToShow; counter++) {
            if(pagingCounter <= 0) pagingCounter = counter;

            if(pagingCounter <= Math.round(response.numFound/perPage)) {
                pager.pages.push(pagingCounter);
                pagingCounter++;
            }
        }

        res.render('activities/search', {
            url: url,
            title: 'Activities',
            activities: activities,
            facets: response_facets,
            pager: pager
        });
    });
}

exports.show = function(req, res){
    var solrQuery = solr.createQuery()
                                   .q({'id' : req.params.aid})
                                   .start(0)
                                   .rows(10);
    
    

    solr.search(solrQuery, function(err, ret) {
        var response = ret.response;

        res.render('activities/show', {
            title: 'Activity',
            activity: response.docs[0],
            exceptionsList: ['id','title','search_all','_version_'],
            referrer: req.header('Referer'),
            findProp: function (arr, val) {
                            var isFound = false;

                            for (var j=0; j < arr.length; j++) {
                                if (arr[j].match(val)) isFound = true;
                            }

                            return isFound;
                        }
        })
    });
}