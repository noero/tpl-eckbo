let database = firebase.database();
const ref = firebase.database().ref(`creneaux`);
let months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
let days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
let time = new Date();
let month = time.getMonth();
let year = time.getFullYear();

document.addEventListener('DOMContentLoaded', function() {
    // Modal info
    let modal = document.getElementById("myModal");

    $.getJSON('config/config.json', function(data) {

        // DATE
        document.getElementById("date_js").innerText = months[month] + " " + year;
        document.getElementById("prev_js").addEventListener("click", function (){
            month -= 1;
            if (month < 0){
                month = 11;
                year -= 1;
            }
            document.getElementById("date_js").innerText = months[month] + " " + year;
            populate();
        });
        document.getElementById("next_js").addEventListener("click", function (){
            month++;
            if (month > 11){
                month = 0;
                year++;
            }
            document.getElementById("date_js").innerText = months[month] + " " + year;
            populate();
        });
        // END DATE
        populate();
        window.onresize = populate;


        function populate(){
            // MENU & CALENDARS
            let cal_menu_html = '';
            let cal_card_html = '';
            let i = 0;
            let xxl;
            let lg;
            let first_day_of_month = get_first_day_of_month();
            let ids = [];
            for (let category of data.categories){
                cal_menu_html += `<h6 class="collapse-header">${category.name} :</h6>`;
                for (let place of category.places){
                    cal_menu_html += `<a class="collapse-item" href="#${place.id}_cal">${place.name}</a>`;
                    let hours_html = '';
                    for (let hour of place.hours){
                        hours_html += `<th scope="col">${hour}h - ${hour + 1}h</th>`;
                    }
                    let days_html = '';
                    for (let week of place.weeks)
                        for (let day of place.days){
                            // TODO ${week}eme ${days[day-1]} du mois (voir Entzheim)
                            let day_date = day - first_day_of_month + 1 + (7 * (week - 1))
                            if ( day_date < 1 ) { continue }
                            if ( day_date > new Date(year, month + 1, -1).getDate()+1) { continue; }
                            let check_html = '';
                            for (let hour of place.hours){
                                let id = `${place.id}_${year}_${month + 1}_${day_date}_${hour}`;
                                check_html += `<td><input class="form-check-input" type="checkbox" id="${id}" value="" aria-label="..."></td>`;
                                ids.push(id);
                            }
                            days_html += `
                                    <tr>
                                        <td class="text-right">${days[day - 1]} ${("0" + day_date).slice(-2)}</td>
                                        ${check_html}
                                    </tr>
                                `
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
                                        <div class="col-auto">
                                            <i class="fas fa-map-marked-alt fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    if (i === 3 || (window.innerWidth < 1400 && i ===2)){
                        cal_card_html += `</div>`;
                        i = 0;
                    }
                }
            }
            document.getElementById("calendars_menu_js").innerHTML = cal_menu_html;
            document.getElementById("cards_js").innerHTML = cal_card_html;

            for (let id of ids){
                ref.child(id).on('value', (snapshot) => {
                    if (snapshot.val() != null) {
                        if (snapshot.val().checked) {
                            $(`#${id}`).prop('checked', true);
                        } else {
                            $(`#${id}`).prop('checked', false);
                        }
                    } else {
                        $(`#${id}`).prop('checked', false);
                    }
                });

                document.getElementById(id).addEventListener("click", function (event){
                    event.preventDefault();
                    let date_js = new Date(id.split('_')[1], parseInt(id.split('_')[2])-1, id.split('_')[3]);
                    let day_js = date_js.getDay();
                    if (day_js === 0) { day_js = 7 }
                    let date = days[day_js - 1] + ' ' + date_js.getDate() + ' ' + months[date_js.getMonth()] + ' ' + date_js.getFullYear()
                    let lieu = null;
                    for (let category of data.categories) {
                        for (let place of category.places) {
                            if (place.id === id.split('_')[0]) { lieu = place.name + ' (' + place.address + ')'}
                        }
                    }
                    let heure = id.split('_')[4] + 'h à ' + (parseInt(id.split('_')[4]) + 1).toString() + 'h'
                    if ($(`#${id}`).prop("checked")) {
                        document.getElementById("modal_js").innerHTML = `
                            <div class="modal-header text-center">
                                <h4 class="mt-2" style="margin-left: auto;margin-right: -10%;">RÉSERVATION</h4>
                                <span class="close" onclick=''>&times;</span>
                            </div>
                            <div class="modal-body text-center">
                                <p>Tu es sur le point de réserver le créneau TPL du<br><strong>${date}</strong><br>de <strong>${heure}</strong><br>à <strong>${lieu}</strong>.</p>
                                <p>Confirmes-tu ?</p>
                            </div>
                            <div class="modal-footer justify-content-center">
                                 <a href="javascript:;" id="cancel" class="btn btn-danger btn_modal">
                                    <span class="icon">
                                        <i class="fas fa-times"></i>
                                    </span>
                                </a>
                                 <a href="javascript:;" id="ok" class="btn btn-success btn_modal">
                                    <span class="icon">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </a>
                            </div>
                        `;
                        modal.style.display = "block";
                        document.getElementsByClassName("close")[0].onclick = function () {
                            modal.style.display = "none";
                        }
                        document.getElementById("cancel").onclick = function () {
                            modal.style.display = "none";
                        }
                        document.getElementById("ok").onclick = function () {
                            if (!$(`#${id}`).prop("checked")) {
                                firebase.database().ref('creneaux/' + id).set({
                                    checked: true
                                });
                                modal.style.display = "none";
                                document.getElementById("modal_js").innerHTML = `
                                    <div class="modal-header text-center">
                                        <h4 class="mt-2" style="margin-left: auto;margin-right: -10%;">MERCI BEAUCOUP</h4>
                                        <span class="close" onclick=''>&times;</span>
                                    </div>
                                    <div class="modal-body text-center">
                                        <p>Merci d'avoir réserver ce créneau TPL.</p>
                                        <p>Pour rappel, il s'agit du<br><strong>${date}</strong><br>de <strong>${heure}</strong><br>à <strong>${lieu}</strong>.</p>
                                        <p>N'oublie pas de l'inscrire dans ton calendrier et de prévenir ton coéquipier.</p>
                                        <p>Bonne prédication !</p>
                                    </div>
                                    <div class="modal-footer justify-content-center">
                                         <a href="javascript:;" id="ok" class="btn btn-success btn_modal">
                                            <span class="icon">
                                                <i class="fas fa-check"></i>
                                            </span>
                                        </a>
                                    </div>
                                `;
                                modal.style.display = "block";
                                document.getElementsByClassName("close")[0].onclick = function () {
                                    modal.style.display = "none";
                                }
                                document.getElementById("ok").onclick = function () {
                                    modal.style.display = "none";
                                }
                            } else {
                                modal.style.display = "none";
                                document.getElementById("modal_js").innerHTML = `
                                    <div class="modal-header text-center">
                                        <h4 class="mt-2" style="margin-left: auto;margin-right: -10%;">OH NON !</h4>
                                        <span class="close" onclick=''>&times;</span>
                                    </div>
                                    <div class="modal-body text-center">
                                        <p>Désolé, tu n'as pas été assez rapide.</p>
                                        <p>Quelqu'un d'autre vient tout juste de réserver ce créneau pendant que tu réfléchissais.</p>
                                        <p>Ce n'est pas grave, peut-être qu'à un autre endroit ou à un autre horaire il reste une disponibilité.</p>
                                    </div>
                                    <div class="modal-footer justify-content-center">
                                         <a href="javascript:;" id="ok" class="btn btn-success btn_modal">
                                            <span class="icon">
                                                <i class="fas fa-check"></i>
                                            </span>
                                        </a>
                                    </div>
                                `;
                                modal.style.display = "block";
                                document.getElementsByClassName("close")[0].onclick = function () {
                                    modal.style.display = "none";
                                }
                                document.getElementById("ok").onclick = function () {
                                    modal.style.display = "none";
                                }
                            }
                        }
                    } else {
                        document.getElementById("modal_js").innerHTML = `
                            <div class="modal-header text-center">
                                <h4 class="mt-2" style="margin-left: auto;margin-right: -10%;">ATTENTION</h4>
                                <span class="close" onclick=''>&times;</span>
                            </div>
                            <div class="modal-body text-center">
                                <p>Tu es sur le point supprimer cette réservation pour le créneau TPL du<br><strong>${date}</strong><br>de <strong>${heure}</strong><br>à <strong>${lieu}</strong>.</p>
                                <p>Veux-tu le supprimer ?</p>
                            </div>
                            <div class="modal-footer justify-content-center">
                                 <a href="javascript:;" id="cancel" class="btn btn-danger btn_modal">
                                    <span class="icon">
                                        <i class="fas fa-times"></i>
                                    </span>
                                </a>
                                 <a href="javascript:;" id="ok" class="btn btn-success btn_modal">
                                    <span class="icon">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </a>
                            </div>
                        `;
                        modal.style.display = "block";
                        document.getElementsByClassName("close")[0].onclick = function () {
                            modal.style.display = "none";
                        }
                        document.getElementById("cancel").onclick = function () {
                            modal.style.display = "none";
                        }
                        document.getElementById("ok").onclick = function () {
                            firebase.database().ref('creneaux/' + id).set({
                                checked: false
                            });
                            modal.style.display = "none";
                        }
                    }
                });
            }
            // END MENU & CALENDARS

        }

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }

    });
});

function get_first_day_of_month() {
    let first_day_of_month = new Date(year, month, 1);
    first_day_of_month = first_day_of_month.getDay();
    if (first_day_of_month === 0) {
        first_day_of_month = 7
    }
    return first_day_of_month
}
