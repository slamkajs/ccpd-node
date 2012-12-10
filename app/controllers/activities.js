var solr = require('../../data/solr_db');

// Activities Home
exports.index = function(req, res){
    var url_parse = req.url.split('?');
    var url = url_parse[0];
    var qs = url_parse[1];
    var page = 0;
    var startRecord = 1;
    var perPage = 10;

    // BREAK APART THE QUERYSTRING
    if(qs && qs.length > 0) {
        qs = qs.split('&')
    }

    // LOOP OVER QUERYSTRING
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

    // DETERMINE IF THE START RECORD HAS BEEN SET TO A NEGATIVE OR ZERO
    if(startRecord <= 0) startRecord = 1;

    // CREATE THE SOLR QUERY
    var solrQuery = solr.createQuery()
                                   .q({'*' : '*'})
                                   .start(startRecord)
                                   .rows(perPage);

    // INIT THE SOLR QUERY
    solr.search(solrQuery, function(err, ret) {
        var response = ret.response;
        var pagesToShow = 10;
        var pagingCounter = Math.round(startRecord/perPage)-(pagesToShow/2);
        var activities = {};
        var pager = {};

        // DEFINE THE ACTIVITIES OBJECT
        activities.list = response.docs;
        activities.count = response.numFound.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // DEFINE THE PAGER OBJECT
        pager.pages = [];
        pager.currentPage = page;
        pager.totalPages = Math.round(response.numFound/perPage);

        // CREATE THE PAGES ARRAY
        for(var counter = 1; counter < pagesToShow; counter++) {
            if(pagingCounter <= 0) pagingCounter = counter;

            if(pagingCounter <= Math.round(response.numFound/perPage)) {
                pager.pages.push(pagingCounter);
                pagingCounter++;
            }
        }

        // RENDER THE PAGE
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

    // BREAK APART THE QUERYSTRING
    if(qs && qs.length > 0) {
        qs = qs.split('&')
    }

    // LOOP OVER THE QUERYSTRING
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

    // DETERMINE IF THE START RECORD WAS SET TO A NEGATIVE OR ZERO
    if(startRecord <= 0) startRecord = 1;

    // BUILD THE SOLR QUERY
    var solrQuery = solr.createQuery()
                                   .qf(query)
                                   .start(startRecord)
                                   .rows(perPage)
                                   .facet({'field':'title'})
                                   .facet({'field':'grouping'})
                                   .facet({'field':'session_type'})
                                   .facet({'field':'activity_type'});

    // RUN THE SOLR QUERY
    solr.search(solrQuery, function(err, ret) {
        var response = ret.response;
        var pagesToShow = 10;
        var activities = {};
        var pager = {};
        var pagingCounter = Math.round(startRecord/perPage)-(pagesToShow/2);

        activities.list = response.docs;
        activities.facets = ret.facet_counts.facet_fields;
        activities.count = response.numFound.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        console.log(activities);
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

        res.render('activities/search', {
            url: url,
            title: 'Activities',
            activities: activities,
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