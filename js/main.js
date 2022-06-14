// Initialize Firebase
let firebaseConfig = {
    apiKey: "AIzaSyCJUBpdCozznOYKnYbPljRJz9_-IEt1s2Q",
    authDomain: "tpl-eckbo-86993.firebaseapp.com",
    databaseURL: "https://tpl-eckbo-86993-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tpl-eckbo-86993",
    storageBucket: "tpl-eckbo-86993.appspot.com",
    messagingSenderId: "344570835130",
    appId: "1:344570835130:web:9e90fd1fa00948e75e5283"
};
let app = firebase.initializeApp(firebaseConfig);
let debug = false;
let triggered = 0;

// Auth
app.auth().signInAnonymously()
    .then(() => {
        // Database
        let database = app.database();
        const ref = database.ref(`slots`);

        // Date
        let months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        let days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        let days_short = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.'];
        let days_list = [];
        if ($(window).width() < 370) {
            days_list = days_short;
        } else {
            days_list = days;
        }

        let time = new Date();
        let yesterday = time.setDate(time.getDate() - 1)
        let month = time.getMonth();
        let year = time.getFullYear();

        // DOM Elements
        let modal = $("#myModal");
        let modal_el = $("#modal_el");
        let date_el = $("#date_el");
        let prev_el = $("#prev_el");
        let next_el = $("#next_el");
        let cards_el = $("#cards_el");
        let calendars_menu_el = $("#calendars_menu_el");
        let sidebar = $(".sidebar");

        // Get and process config.json
        $.getJSON('config/config.json', function(data) {

            // Date header
            date_el.text(months[month] + " " + year);
            prev_el.click(function (){
                month -= 1;
                if (month < 0){
                    month = 11;
                    year--;
                }
                date_el.text(months[month] + " " + year);
                populate();
            });
            next_el.click(function (){
                month++;
                if (month > 11){
                    month = 0;
                    year++;
                }
                date_el.text(months[month] + " " + year);
                populate();
            });
            // END Date header

            populate();
            window.onresize = populate;

            function populate(){
                // MENU & CALENDARS
                let cal_menu_html = '';
                let cal_card_html = '';
                let i = 0;
                let xxl;
                let lg;
                let ids = [];
                let spots_by_place = 0;
                let total_spots = 0;

                // Parsing categories
                for (let category of data.categories) {
                    cal_menu_html += `<h6 class="collapse-header">${category.name} :</h6>`;

                    // Parsing places
                    for (let place of category.places) {
                        cal_menu_html += `<a class="collapse-item hide_sidebar" href="#${place.id}_cal">${place.name}</a>`;
                        let hours_html = '';
                        for (let hour of place.hours){
                            hours_html += `<th scope="col">${hour}h - ${hour + 1}h</th>`;
                        }
                        let days_html = '';
                        for (let d = 1; d <= new Date(year, month + 1, -1).getDate() + 1; d++) {
                            let tmp_date = new Date(year, month, d);
                            if (tmp_date > yesterday || debug === true) {
                                let tmp_day = tmp_date.getDay();
                                if (tmp_day === 0) { tmp_day = 7; }
                                if (place.days.includes(tmp_day)){
                                    if (place.weeks.includes((Math.floor(d / 7) + 1))){
                                        let check_html = '';
                                        for (let hour of place.hours) {
                                            let id = `${place.id}_${year}_${month + 1}_${d}_${hour}`;
                                            check_html += `<td><input class="form-check-input" type="checkbox" id="${id}" value="" aria-label="..."></td>`;
                                            ids.push(id);
                                            spots_by_place++;
                                            total_spots++;
                                        }
                                        days_html += `
                                            <tr>
                                                <td class="text-right">${days_list[tmp_day - 1]} ${("0" + d).slice(-2)}</td>
                                                ${check_html}
                                            </tr>
                                        `;
                                    }
                                }
                            }
                        }
                        if (place.hours.length < 3){
                            i++;
                            xxl = 4;
                            lg = 6;
                        } else {
                            i += 1.5;
                            xxl = 6;
                            lg = 12;
                        }
                        if ( i <= 1.5 ) { cal_card_html += `<div class="row">`; }
                        if (spots_by_place > 0) {
                            cal_card_html += `
                                <div id="${place.id}_cal" class="col-xxl-${xxl} col-lg-${lg} col-md-12 mb-4">
                                    <div class="card border-left-primary shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-up">
                                                <div class="col mr-2">
                                                    <div class="font-weight-bold text-primary text-uppercase mb-2">
                                                        ${place.name}
                                                    <span class="text-dark font-weight-normal text-capitalize mb-1">
                                                        - ${place.address}</span>
                                                    </div>
                                                    <div class="h6 mb-0">
                                                        <table class="table text-center">
                                                            <thead>
                                                            <tr>
                                                                <th scope="col"></th>
                                                                ${hours_html}
                                                            </tr>
                                                            </thead>
                                                            <tbody class="table-group-divider">
                                                            ${days_html}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <!--<div class="col-auto">-->
                                                <!--<i class="fas fa-map-marked-alt fa-2x"></i>-->
                                                <!--</div>-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        } else {
                            cal_card_html += `
                                <div id="${place.id}_cal" class="col-xxl-${xxl} col-lg-${lg} col-md-12 mb-4">
                                    <div class="card border-left-danger shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-up">
                                                <div class="col mr-2">
                                                    <div class="font-weight-bold text-primary text-uppercase mb-2">
                                                        ${place.name}
                                                    <span class="text-dark font-weight-normal text-capitalize mb-1">
                                                        - ${place.address}</span>
                                                    </div>
                                                    <div class="h3 mb-0 text-center mt-3">
                                                        Plus aucun créneau ce mois-ci
                                                    </div>
                                                </div>
                                                <!--<div class="col-auto">-->
                                                <!--<i class="fas fa-map-marked-alt fa-2x"></i>-->
                                                <!--</div>-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        if (i === 3 || (window.innerWidth < 1400 && i ===2)){
                            cal_card_html += `</div>`;
                            i = 0;
                        }
                    }
                    spots_by_place = 0;
                }
                if (total_spots === 0 && debug === false){
                    cal_card_html = `
                        <div class="row">
                        <div class="col mb-4 ">
                            <div class="card text-center h3 border-left-danger">
                                <div class="card-body mb-auto mt-auto">
                                    Plus aucun créneau ce mois-ci
                                </div>
                            </div>
                            </div>
                        </div>
                    `;
                }
                calendars_menu_el.html(cal_menu_html);
                cards_el.html(cal_card_html);

                // Hiding sidebar on click on menu item with small screen
                $('.hide_sidebar').click(function() {
                    if ($(window).width() < 768) {
                        $("body").toggleClass("sidebar-toggled");
                        sidebar.toggleClass("toggled");
                        if (sidebar.hasClass("toggled")) {
                            $('.sidebar .collapse').collapse('hide');
                        }
                    }
                });

                // Modal on click on checkboxes
                for (let id of ids){
                    let id_el = $(`#${id}`);

                    // Reading database to populate checkboxes
                    ref.child(id).on('value', (snapshot) => {
                        if (snapshot.val() != null) {
                            if (snapshot.val().checked) {
                                id_el.prop('checked', true);
                            } else {
                                id_el.prop('checked', false);
                            }
                        } else {
                            id_el.prop('checked', false);
                        }
                    });

                    // On click on checkbox
                    id_el.click(function (event){
                        event.preventDefault();

                        // Getting infos from id
                        let jsDate = new Date(id.split('_')[1], parseInt(id.split('_')[2])-1, id.split('_')[3]);
                        let jsDay = jsDate.getDay();
                        if (jsDay === 0) { jsDay = 7; }
                        let date = days[jsDay - 1] + ' ' + jsDate.getDate() + ' ' + months[jsDate.getMonth()] + ' ' + jsDate.getFullYear();
                        let lieu = null;
                        for (let category of data.categories) {
                            for (let place of category.places) {
                                if (place.id === id.split('_')[0]) { lieu = place.name + ' (' + place.address + ')'}
                            }
                        }
                        let heure = id.split('_')[4] + 'h à ' + (parseInt(id.split('_')[4]) + 1).toString() + 'h';

                        // html models
                        let html_modal_cancel_button = `
                            <a href="javascript:;" id="cancel" class="btn btn-danger btn_modal">
                                <span class="icon">
                                    <i class="fas fa-times"></i>
                                </span>
                            </a>
                        `;
                        let html_modal_ok_button = `
                             <a href="javascript:;" id="ok" class="btn btn-success btn_modal">
                                <span class="icon">
                                    <i class="fas fa-check"></i>
                                </span>
                             </a>
                        `;
                        let html_modal_model = `
                            <div class="modal-header text-center">
                                <h4 class="mt-2" style="margin-left: auto;margin-right: -10%;">{0}</h4>
                                <span class="close" onclick=''>&times;</span>
                            </div>
                            <div class="modal-body text-center pt-3">
                                {1}
                            </div>
                            <div class="modal-footer justify-content-center">
                                 {2}
                                 {3}
                            </div>
                        `;

                        // Reservation modal
                        if ($(`#${id}`).prop("checked")) {
                            let title = 'RÉSERVATION'
                            let text = `
                                <p>Tu es sur le point de réserver le créneau TPL du<br><strong>${date}</strong><br>de <strong>${heure}</strong><br>à <strong>${lieu}</strong>.</p>
                                <p>Confirmes-tu ?</p>  
                            `;
                            modal_el.html(html_modal_model.format(
                                title,
                                text,
                                html_modal_cancel_button,
                                html_modal_ok_button
                            ));
                            modal.css('display', "block");
                            $(".close, #cancel").click(function () {
                                modal.css('display', "none");
                            });
                            $("#ok").click(function () {
                                // Reminder modal
                                if (!$(`#${id}`).prop("checked")) {
                                    ref.child(id).set({
                                        checked: true
                                    });
                                    modal.css('display', "none");
                                    let title = 'MERCI BEAUCOUP'
                                    let text = `
                                        <p>Merci d'avoir réservé ce créneau TPL.</p>
                                        <p>Pour rappel, il s'agit du<br><strong>${date}</strong><br>de <strong>${heure}</strong><br>à <strong>${lieu}</strong>.</p>
                                        <p>N'oublie pas de l'inscrire dans ton calendrier et de prévenir ton coéquipier.</p>
                                        <p>Bonne prédication !</p> 
                                    `;
                                    modal_el.html(html_modal_model.format(
                                        title,
                                        text,
                                        '',
                                        html_modal_ok_button
                                    ));
                                    modal.css('display', "block");
                                    $(".close, #ok").click(function () {
                                        modal.css('display', "none");
                                    });
                                } else {
                                    // To late modal
                                    modal.css('display', "none");
                                    let title = 'OH NON !'
                                    let text = `
                                        <p>Désolé, tu n'as pas été assez rapide.</p>
                                        <p>Quelqu'un d'autre vient tout juste de réserver ce créneau pendant que tu réfléchissais.</p>
                                        <p>Ce n'est pas grave, peut-être qu'à un autre endroit ou à un autre horaire il reste une disponibilité.</p>
                                    `;
                                    modal_el.html(html_modal_model.format(
                                        title,
                                        text,
                                        '',
                                        html_modal_ok_button
                                    ));
                                    modal.css('display', "block");
                                    $(".close, #ok").click(function () {
                                        modal.css('display', "none");
                                    });
                                }
                            });
                        } else {
                            // Delete modal
                            let title = 'ATTENTION'
                            let text = `
                                <p>Tu es sur le point de supprimer cette réservation pour le créneau TPL du<br><strong>${date}</strong><br>de <strong>${heure}</strong><br>à <strong>${lieu}</strong>.</p>
                                <p>Veux-tu le supprimer ?</p>
                            `;
                            modal_el.html(html_modal_model.format(
                                title,
                                text,
                                html_modal_cancel_button,
                                html_modal_ok_button
                            ));
                            modal.css('display', "block");
                            $(".close, #cancel").click(function () {
                                modal.css('display', "none");
                            });
                            $("#ok").click(function () {
                                ref.child(id).set({
                                    checked: false
                                });
                                modal.css('display', "none");
                            });
                        }
                    });
                }
                // END MENU & CALENDARS

            }

        });

        // Hide modal on click
        $(window).click(function(event) {
            let mod = document.getElementById("myModal");
            if (event.target === mod) {
                modal.css('display', "none");
            }
        });

        // Hide sidebar on scroll on mobile devices
        cards_el.on('touchstart', function (){
            if (!sidebar.hasClass("toggled")) {
                sidebar.toggleClass("toggled");
                $('.sidebar .collapse').collapse('hide');
            }
        });

        // Useful function to format string
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{([0-9]+)}/g, function (match, index) {
                return typeof args[index] == 'undefined' ? match : args[index];
            });
        };

    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });

$(window).keypress(function( event ) {
    if (event.which === 97) {
        event.preventDefault();
        triggered++;
    }
    if (triggered >= 5) {
        debug = true;
    }
});
