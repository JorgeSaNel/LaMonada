import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { BusinessActivity } from '/imports/api/collections/methods.js';
import { Matches } from '/imports/api/collections/methods.js';

import './showBoard.html';
import './showBoard.css';
require("jquery-imagemapster");

var countOfCliks = 0;
var firstCaption, secondCaption;
Template.ImageOfBoard.onRendered(function () {
    // A cross reference of area names to text to be shown for each area
    var captions = {
        GastosProduccion: ["Gastos de Producción"],
        GastosComercializacion: ["Gastos de Comercialización"],
        GastosAdministracion: ["Gastos de Administración"],
        GastosGenerales: ["Gastos Generales"],
        AmortizacionMaterial: ["Amortización inmovilizado Material"],
        AmortizacionInmaterial: ["Amortización inmovilizado Inmaterial"],
        IngresosFinancieros: ["Ingresos Financieros"],
        GastosFinancieros: ["Gastos Financieros"],
        Dividendos: ["Dividendos"],

        InmovilizadoInmaterial: ["Inmovilizado Inmaterial"],
        InmovilizadoMaterial: ["Inmovilizado Material"],
        Existencias: ["Existencias"],
        Clientes: ["Clientes"],
        InversionesFinancieras: ["Inversiones Financieras a Corto Plazo"],
        CajaBancos: ["Caja y Bancos"],

        CapitalSocial: ["Capital Social"],
        Reservas: ["Reservas"],
        Prestamos: ["Préstamos Bancarios a Largo Plazo"],
        Hacienda: ["Hacienda"],
        Proveedores: ["Proveedores"]
    };

    var colors = [
        //Outside Part
        {
            key: "GastosProduccion",
            toolTip: "Gastos de Producción"
        },
        {
            key: "GastosComercializacion",
            toolTip: "Gastos de Comercialización"
        },
        {
            key: "GastosAdministracion",
            toolTip: "Gastos de Administración"
        },
        {
            key: "GastosGenerales",
            toolTip: "Gastos Generales"
        },
        {
            key: "AmortizacionMaterial",
            toolTip: "Amortización Material"
        },
        {
            key: "AmortizacionInmaterial",
            toolTip: "Amortización Inmaterial"
        },
        {
            key: "IngresosFinancieros",
            toolTip: "Ingresos Financieros"
        },
        {
            key: "GastosFinancieros",
            toolTip: "Gastos Financieros"
        },
        {
            key: "Dividendos",
            toolTip: "Dividendos"
        },

        // Blue Part
        {
            key: "InmovilizadoInmaterial",
            fillColor: "1A17C7",
            strokeColor: "3320FF",
            toolTip: "Inmovilizado Inmaterial"
        },
        {
            key: "InmovilizadoMaterial",
            fillColor: "1A17C7",
            strokeColor: "3320FF",
            toolTip: "Inmovilizado Material"
        },
        {
            key: "Existencias",
            fillColor: "7D7DBD",
            strokeColor: "3320FF",
            toolTip: "Existencias"
        },
        {
            key: "Clientes",
            fillColor: "7D7DBD",
            strokeColor: "3320FF",
            toolTip: "Clientes"
        },
        {
            key: "InversionesFinancieras",
            fillColor: "7D7DBD",
            strokeColor: "3320FF",
            toolTip: "Inversiones Financieras a Corto Plazo"
        },
        {
            key: "CajaBancos",
            fillColor: "7D7DBD",
            strokeColor: "3320FF",
            toolTip: "Caja y Bancos"
        },

        //Pink Part
        {
            key: "CapitalSocial",
            strokeColor: "7D7DBD",
            fillColor: "C51D74",
            toolTip: "Capital Social"
        },
        {
            key: "Reservas",
            strokeColor: "7D7DBD",
            fillColor: "C51D74",
            toolTip: "Reservas"
        },
        {
            key: "Prestamos",
            strokeColor: "7D7DBD",
            fillColor: "C51D74",
            toolTip: "Prestamos bancarios a Largo Plazo"
        },
        {
            key: "Hacienda",
            strokeColor: "7D7DBD",
            fillColor: "ffffff",
            toolTip: "Hacienda"
        },
        {
            key: "Proveedores",
            strokeColor: "7D7DBD",
            fillColor: "ffffff",
            toolTip: "Proveedores"
        }
    ]

    var options = {
        fillOpacity: 0.4,
        fillColor: "B46464",
        stroke: true,
        strokeColor: "C51D1D",
        strokeOpacity: 0.8,
        strokeWidth: 4,
        mapKey: 'name',
        listKey: 'name',
        showToolTip: true,
        areas: colors,
        onClick: function (e) {
            var singleSelecImage = false;
            countOfCliks += 1;
            if (countOfCliks % 2 === 0) {
                secondCaption = captions[e.key];
                var newText = "De <b>" + firstCaption + "</b> va a <b>" + secondCaption + "</b>";
                $('#selections').html(newText);

                image.mapster('rebind', options);
            } else {
                firstCaption = captions[e.key];
                var newText = "De <b>" + captions[e.key] + "</b> va a <i> ...(eliga otra casilla para continuar)</i>"
                $('#selections').html(newText);

                if (countOfCliks != 1)
                    singleSelecImage = true;
            }

            image.mapster('set_options', {
                singleSelect: singleSelecImage
            });
        },

    }

    var image = $('#FullBoard');
    image.mapster(options);
    image.mapster('resize', 600, 0, 400);
});

Template.ImageOfBoard.events({
    'click #Board': function (event, template) {
        //User's cliked twice, check if he's made the correct movement
        if (countOfCliks % 2 === 0) {
            event.preventDefault();

            var correctAnswer = false;
            var activity = BusinessActivity.findOne({
                "year": activityYear,
                "_id": String(activityId)
            });

            if ((activity.from == firstCaption || activity.from == secondCaption) &&
                (activity.to == firstCaption || activity.to == secondCaption)) {

                Bert.alert('Enhorabuena! Has acertado', 'success', 'fixed-bottom', 'fa-check');

                correctAnswer = true;
                activityId += 1;
                changeActivityText();
            } else
                Bert.alert('La combinación no es correcta. Por favor, vuelve a intentarlo', 'warning', 'fixed-top', 'fa-remove');

            Meteor.call('insertUserActivity', Number(activityId), Number(activityYear),
                                            String(firstCaption), String(secondCaption), correctAnswer);
        }
    },
});

Template.ActivityText.onRendered(function () {
    changeActivityText();
});

Template.StartSecondPhase_Board.helpers({
    isCorrectUser() {
        return Matches.findOne({ "user": String(Meteor.userId()) });
    }
})

var activityId = 1;
var activityYear = 1;
var fullTextOfActivities = "";
function changeActivityText() {
    var lastActivity = Matches.findOne({ "user": String(Meteor.userId()), "GameNumber": GetGameNumber() })

    var activity = BusinessActivity.findOne({
        "year": activityYear,
        "_id": String(activityId)
    });

    if (activity.isStatement)
        fullTextOfActivities = fullTextOfActivities + activity.activity + "<br>";
    else
        fullTextOfActivities = fullTextOfActivities + "<li style='margin-left:2em'>" + activity.activity + "</li>";

    //Go to last activity answered correctly
    if(lastActivity.lastActivityAnsweredCorrectly != activityId){
        activityId += 1;
        changeActivityText();
    }

    //If it's just text, call again the function until there's a movement on DDBB
    if (activity.quantity === undefined) {
        activityId += 1;
        changeActivityText();
    }

    $('#activityText').html(fullTextOfActivities);
}

function GetGameNumber() {
    var getNumber = Matches.findOne({ "user": Meteor.userId() }, { "GameNumber": 1, sort: { "GameNumber": -1 } });
    return getNumber.GameNumber;
}

