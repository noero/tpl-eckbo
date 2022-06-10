# tpl-eckbo

"tpl-eckbo" est un site internet permettant la gestion du programme de témoignage publique (TPL) d'une assemblée locale (ici Strasbourg Eckbolsheim).  
Ce site ne détient aucune données personnelles.

## Configuration
#### Un fichier config.json  

L'ajout des points TPL se font via la fichier *__config/config.json__*.  
Ce fichier suit l'arborescence suivante :  

```
{
  "categories": [
    {
      "name": "Catégorie 1",                # Nom de la catégorie (ex: Jour de Marché)
      "places": [
        {
          "id": "lieu1",                    # Abréviation unique du lieu
          "name": "Nom du Lieu",
          "address": "Adresse du Lieu",
          "coordinates": "",                # Pas encore implémenté
          "days": [ 6 ],                    # Les jours pour les créneaux (de 1 (lundi) à 7 (dimanche))
          "weeks": [ 2, 4 ],                # Les semaines pour les créneaux (ex: ici ce sont les 2ème et 4ème samedis du mois)
          "hours": [ 10, 11 ]               # Les heures pour les créneaux (ex: à 10h et à 11h)
        },
        {
        ...
        }]
    },
    {
    ...
    }]
}
```

#### Une base de données Firebase

Créer une base de données en temps réel Firebase et inscrire les informations fournies (*firebaseConfig*) dans le fichier *__index.html__*.  
Voici une page d'aide pour créer une base de données Firebase [ici](https://firebase.google.com/docs/database/web/start#create_a_database).


## Utilisation

Les compagnons ayant accès au site pourront réserver un créneau tout en s'assurant de sa disponibilité.  
Le site ne gère pas la recherche et association d'un coéquipier, ni ne possède de fonction de rappel.  
Cela reste à la charge des compagnons.
