    var Airtable = require('airtable');
    Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: 'keyTUBrmlH47vlGZo'
    });
    var base = Airtable.base('appOCFUxUXSybdimS');

    // Mon horloge

    var titresTemplates = '<div class="veilles mt-5" data-id="###veilleId###">' +
        '<div class="row">' +
        '<div class="col-4">' +
        '<img class="image" src="###img###" width="160px">' +
        '</div>' +
        '<div class="col-8">' +
        '<h5 class="titres">###titres###</h5>' +
        '</div></div>' +
        '<div class="row">' +
        '<div class="col">' +
        '<div class="date_veille">###date###</div></div>' +
        '<div class="col">' +
        '<button class="btn btn-primary ml-3" onclick="setStorage(\'###veilleId###\')">Voir ++</button>' +
        '</div></div></div>'

    base('Table 1').select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 50000000,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function (record) {

            var date = record.get('date');
            date = date.split('-');
            date = date.reverse();
            date = date.join('-');;
            var img = record.get('Image')
            img = img[0].url
            var titres = record.get('Subject');

            var newTitres = "";
            newTitres = titresTemplates.replace(/###veilleId###/gi, record.id);
            newTitres = newTitres.replace('###img###', img)
            newTitres = newTitres.replace('###date###', date);
            newTitres = newTitres.replace('###titres###', titres);
            $("#liste").prepend(newTitres);

        });
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage()
    }, function done(err) {
        if (err) {
            console.error(err);
            return;
        }
    });

    function setStorage(index) {
        console.log("index", index);
        localStorage.setItem("id", index);
        window.location = "detail.html";

    }


    function getVeille(veilleId) {
        base('Table 1').find(veilleId, function (err, record) {
            if (err) {
                console.error(err);
                return;
            }
            var id = record.get('Id')
            var date = record.get('date')
            var sujet = record.get('Subject')
            var synthese = record.get('Synthesis')
            var comment = record.get('Comment')
            var lien = record.get('Links')
            var img = record.get('Image')
            img = img[0].url
            $("#id_veille").html(id);
            $("#date").html(date);
            $("#subject").html(sujet);
            $("#synthesis").html(synthese);
            $("#comments").html(comment);
            $(".links").html(lien);
            $("#image").find("img").attr("src", img);
            console.log('Retrieved', record.id);
        });
    }