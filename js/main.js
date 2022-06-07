let months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
let days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
let time = new Date();
let month = time.getMonth();
let year = time.getFullYear();

document.addEventListener('DOMContentLoaded', function() {
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
            populate()
        });
        document.getElementById("next_js").addEventListener("click", function (){
            month++;
            if (month > 11){
                month = 0;
                year++;
            }
            document.getElementById("date_js").innerText = months[month] + " " + year;
            populate()
        });
        // END DATE
        populate()

        function populate(){

            // MENU & CALENDARS
            let cal_menu_html = '';
            let cal_card_html = '';
            let i = 0;
            let l;
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
                                // TODO Link Checkbox with firebase
                                check_html += `<td><input class="form-check-input" type="checkbox" id="${place.id}_${year}_${month + 1}_${day_date}_${hour}" value="" aria-label="..."></td>`;
                                ids.push(`${place.id}_${year}_${month + 1}_${day_date}_${hour}`);
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
                        l = 4;
                    } else {
                        i += 1.5;
                        l = 6;
                    }
                    if (i <= 1.5) { cal_card_html += `<div class="row">`; }
                    cal_card_html += `
                        <div id="${place.id}_cal" class="col-xl-${l} col-md-6 mb-4">
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
                    if (i === 3){
                        cal_card_html += `</div>`;
                        i = 0;
                    }
                }
            }
            document.getElementById("calendars_menu_js").innerHTML = cal_menu_html;
            document.getElementById("cards_js").innerHTML = cal_card_html;
            for (let id of ids){
                document.getElementById(id).addEventListener("change", function (event){
                    // TODO Link with Firebase
                })
            }
            // END MENU & CALENDARS

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
