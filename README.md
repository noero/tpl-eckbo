# tpl-eckbo

"tpl-eckbo" est un site internet permettant la gestion du programme de témoignage public (TPL) d'une assemblée locale (ici Strasbourg Eckbolsheim).  
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

Créer une base de données en temps réel Firebase et inscrire les informations fournies (*firebaseConfig*) dans le fichier *__js/mains.js__*.  
Voici une page d'aide pour créer une base de données Firebase [ici](https://firebase.google.com/docs/database/web/start#create_a_database).
Ajouter une authentification "Anonyme" au projet.

###### Configuration des règles de la BDD

```
{
  "rules": {
    ".read": "auth.uid != null",
    ".write": "auth.uid != null",
  }
}
```

###### Configuration de la clé API Firebase

Accéder au [Google Cloud Platform](https://console.cloud.google.com) de votre compte Gmail. Dans le menu "API et services" > "Identifiants", 
paramétrer votre API Key avec une restriction liée à votre nom de domaine (URL de provenance HTTP).

###### Configuration du reCaptcha

Enregistrer un site pour [Google Google reCaptcha](https://www.google.com/recaptcha/admin/create) associé votre compte Gmail.  
Selectionner Google reCaptcha version 2 > Badge Google reCaptcha invisible et ajouter votre nom de domaine.
Dans le fichier *__login.php__*, modifier le mot de passe du site et les clefs reCaptcha.

## Utilisation

Les compagnons ayant accès au site pourront réserver un créneau tout en s'assurant de sa disponibilité.  
Le site ne gère pas la recherche et association d'un coéquipier, ni ne possède de fonction de rappel.  
Cela reste à la charge des compagnons.

###### Astuce pour le RPP

Presser 5 fois la lettre 'a' permet de visualiser les anciennes participations.
