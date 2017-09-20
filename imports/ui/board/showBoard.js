import { Template } from 'meteor/templating';

import './showBoard.html';
import './showBoard.css';
require("jquery-imagemapster");

Template.ImageOfBoard.onRendered(function () {
    // Set up some options objects: 'single_opts' for when a single area is selected, which will show just a border
    // 'all_opts' for when all are highlighted, to use a different effect - shaded white with a white border
    // 'initial_opts' for general options that apply to the whole mapster. 'initial_opts' also includes callbacks
    // onMouseover and onMouseout, which are fired when an area is entered or left. We will use these to show or
    // remove the captions, and also set a flag to let the other code know if we're currently in an area.

    var inArea,
        image = $('#FullBoard'),
        captions = {
            GastosProduccion: ["Gastos de Producción"],
            GastosComercializacion: ["Gastos de Comercialización"],
            GastosAdministracion: ["Gastos de Administración"],
            GastosGenerales: ["Gastos Generales"],
            AmortizacionMaterial: ["Amortización Material"],
            AmortizacionInmaterial: ["Amortización Inmaterial"],
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
        },
        single_opts = {
            fillColor: '000000',
            fillOpacity: 0,
            stroke: true,
            strokeColor: 'ff0000',
            strokeWidth: 2
        },
        all_opts = {
            fillColor: 'ffffff',
            fillOpacity: 0.6,
            stroke: true,
            strokeWidth: 2,
            strokeColor: 'ffffff'
        },
        initial_opts = {
            mapKey: 'data-name',
            isSelectable: false,
            onMouseover: function (data) {
                inArea = true;
                $('#boardPart-caption-header').text(captions[data.key]);
                $('#board-caption').show();
            },
            onMouseout: function (data) {
                inArea = false;
                $('#board-caption').hide();
            }
        };
    opts = $.extend({}, all_opts, initial_opts, single_opts);


    // Bind to the image 'mouseover' and 'mouseout' events to activate or deactivate ALL the areas, like the
    // original demo. Check whether an area has been activated with "inArea" - IE<9 fires "onmouseover" 
    // again for the image when entering an area, so all areas would stay highlighted when entering
    // a specific area in those browsers otherwise. It makes no difference for other browsers.

    image.mapster('unbind').mapster(opts).bind('mouseover', function () {
        if (!inArea) {
            image.mapster('set_options', all_opts)
                .mapster('set', true, 'all')
                .mapster('set_options', single_opts);
        }
    }).bind('mouseout', function () {
        if (!inArea) {
            image.mapster('set', false, 'all');
        }
    });

    image.mapster('resize', 600, 0, 400);
});

var countOfCliks = 0;
var firstCaption, secondCaption;
Template.Second.onRendered(function () {
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

    var image = $('#FullBoard');

    image.mapster({
        fillOpacity: 0.4,
        fillColor: "B46464",
        stroke: true,
        strokeColor: "C51D1D",
        strokeOpacity: 0.8,
        strokeWidth: 4,
        mapKey: 'name',
        listKey: 'name',
        onClick: function (e) {
            var singleSelecImage = false;
            countOfCliks += 1;
            if(countOfCliks % 2 === 0){
                secondCaption = captions[e.key];
                var newText = "Se pinchó en - " + firstCaption + " - y ahora en - " + secondCaption + " -";
                $('#selections').html(newText);

                Bert.alert('Has fallado. Por favor, vuelve a intentarlo', 'warning', 'fixed-top', 'fa-remove');
            }else{
                firstCaption = captions[e.key];
                var newText = "Se pinchó en - " + captions[e.key]
                $('#selections').html(newText);

                if(countOfCliks != 1)
                    singleSelecImage = true;
            }

            image.mapster('set_options', {
                singleSelect: singleSelecImage
            });
        },
        showToolTip: true,
        toolTipClose: ["tooltip-click", "area-click"],
        areas: colors
    });

    image.mapster('resize', 600, 0, 400);
});