/*
 * Seerema Business Solutions - http://www.seerema.com/
 * 
 * Copyright 2020 IvaLab Inc. and by respective contributors (see below).
 * 
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Contributors:
 * 
 */

"use strict";

// List of labels for Base Services
(function(web_app) {
  web_app.load_ll_set({
    LL_HIDE_SIDEBAR: {
      "en": "Hide Sidebar",
      "fr": "Masquer la barre latérale",
      "ru": "Спрятать боковое меню",
      "es": "Esconder barra lateral",
      "de": "Seitenleiste ausblenden"
    },
    
    LL_SHOW_SIDEBAR: {
      "en": "Show Sidebar",
      "fr": "Afficher la barre latérale",
      "ru": "Показать боковое меню",
      "es": "Mostrar barra lateral",
      "de": "Seitenleiste anzeigen"
    },
    
    LL_CATALOGS: {
      "en": "Catalogs",
      "fr": "Catalogues",
      "ru": "Каталоги",
      "es": "Catálogos",
      "de": "Kataloge"
    },
    
    LL_COUNTRIES: {
      "en": "Countries",
      "fr": "Des pays",
      "ru": "Страны",
      "es": "Países",
      "de": "Länder"
    },
    
    LL_REGION: {
      "en": "Region",
      "fr": "Région",
      "ru": "Область",
      "es": "Región",
      "de": "Region"
    },
    
    LL_REGIONS: {
      "en": "Regions",
      "fr": "Régions",
      "ru": "Области",
      "es": "Regiones",
      "de": "Regionen"
    },
    
    LL_CITIES: {
      "en": "Cities",
      "fr": "Villes",
      "ru": "Города",
      "es": "Ciudades",
      "de": "Städte"
    },
    
    LL_ADDRESSES: {
      "en": "Addresses",
      "fr": "Adresses",
      "ru": "Адреса",
      "es": "Direcciones",
      "de": "Adressen"
    },
    
    LL_ERROR_VALUE_VALIDATION: {
      "en": "Value validation error.",
      "fr": "Erreur de validation de la valeur.",
      "ru": "Ошибка проверки значения поля.",
      "es": "Error de validación de valor.",
      "de": "Wertüberprüfungsfehler."
    },
    
    LL_ERROR_CREATE_ENTITY: {
      "en": "Error creating entity.",
      "fr": "Erreur lors de la création de l'entité.",
      "ru": "Ошибка создания объекта.",
      "es": "Error al crear la entidad.",
      "de": "Fehler beim Erstellen der Entität."
    },
    
    LL_ERROR_SAVE_ENTITY: {
      "en": "Error saving entity.",
      "fr": "Erreur lors de l'enregistrement de l'entité.",
      "ru": "Ошибка сохранения объекта.",
      "es": "Error al guardar la entidad.",
      "de": "Fehler beim Speichern der Entität."
    },
    
    LL_ERROR_DELETE_ENTITY: {
      "en": "Error deleting entity.",
      "fr": "Erreur lors de la suppression de l'entité.",
      "ru": "Ошибка удаления объекта.",
      "es": "Error al eliminar la entidad.",
      "de": "Fehler beim Löschen der Entität."
    },
    
    LL_ERROR_READ_COUNTRY_LIST: {
      "en": "Error read List of Countries",
      "fr": "Erreur de lecture de la liste des pays",
      "ru": "Ошибка чтения списка стран",
      "es": "Error al leer la lista de países",
      "de": "Fehler beim Lesen der Länderliste"
    },
    
    LL_ERROR_READ_REGION_LIST: {
      "en": "Error read List of Regions",
      "fr": "Erreur de lecture de la liste des régions",
      "ru": "Ошибка чтения списка регионов",
      "es": "Error al leer la lista de regiones",
      "de": "Fehler beim Lesen der Liste der Regionen"
    },
    
    LL_LIST_OF_COUNTRIES: {
      "en": "List of Countries",
      "fr": "Liste des pays",
      "ru": "Список Стран",
      "es": "Listado de paises",
      "de": "Liste der Länder"
    },
    
    LL_ADD_NEW_COUNTRY: {
      "en": "Add New Country",
      "fr": "Ajouter un nouveau pays",
      "ru": "Добавить Новую Страну",
      "es": "Agregar nuevo país",
      "de": "Neues Land hinzufügen"
    },
    
    LL_UPDATE_EXISTING_COUNTRY: {
      "en": "Update Existing Country",
      "fr": "Mettre à jour le pays existant",
      "ru": "Редактировать Существующую Страну",
      "es": "Actualizar país existente",
      "de": "Aktualisieren Sie das vorhandene Land"
    },
    
    LL_COUNTRY: {
      "en": "Country",
      "fr": "Pays",
      "ru": "Страна",
      "es": "País",
      "de": "Land"
    },
    
    LL_LIST_OF_REGIONS: {
      "en": "List of Regions",
      "fr": "Liste des régions",
      "ru": "Список Регионов",
      "es": "Lista de regiones",
      "de": "Liste der Regionen"
    },
    
    LL_ADD_NEW_REGION: {
      "en": "Add New Region",
      "fr": "Ajouter une nouvelle région",
      "ru": "Добавить Новый Регион",
      "es": "Agregar nueva región",
      "de": "Neue Region hinzufügen"
    },

    LL_ADD_NEW_LL_STATE: {
      "en": "Add New State",
      "fr": "Ajouter un nouvel état",
      "ru": "Добавить Новый Штат",
      "es": "Agregar nuevo estado",
      "de": "Neuen Status hinzufügen"
    },

    LL_ADD_NEW_LL_PROVINCE: {
      "en": "Add New Province",
      "fr": "Ajouter une nouvelle province",
      "ru": "Добавить Новую Провинцию",
      "es": "Añadir nueva provincia",
      "de": "Neue Provinz hinzufügen"
    },
    
    LL_UPDATE_EXISTING_REGION: {
      "en": "Update Existing Region",
      "fr": "Mettre à jour la région existante",
      "ru": "Редактировать Существующий Регион",
      "es": "Actualizar región existente",
      "de": "Vorhandene Region aktualisieren"
    },
    
    LL_UPDATE_EXISTING_LL_STATE: {
      "en": "Update Existing State",
      "fr": "Mettre à jour l'état existant",
      "ru": "Редактировать Существующий Штат",
      "es": "Actualizar estado existente",
      "de": "Bestehenden Status aktualisieren"
    },

    LL_UPDATE_EXISTING_LL_PROVINCE: {
      "en": "Update Existing Province",
      "fr": "Mettre à jour la province existante",
      "ru": "Редактировать Существующую Провинцию",
      "es": "Actualizar provincia existente",
      "de": "Bestehende Provinz aktualisieren"
    },

    LL_LIST_OF_CITIES: {
      "en": "List of Cities",
      "fr": "Liste des villes",
      "ru": "Список Городов",
      "es": "Listado de ciudades",
      "de": "Liste der Städte"
    },
    
    LL_ADD_NEW_CITY: {
      "en": "Add New City",
      "fr": "Ajouter une nouvelle ville",
      "ru": "Добавить Новый Город",
      "es": "Agregar nueva ciudad",
      "de": "Neue Stadt hinzufügen"
    },
    
    LL_UPDATE_EXISTING_CITY: {
      "en": "Update Existing City",
      "fr": "Ajouter une nouvelle ville",
      "ru": "Редактировать Существующий Город",
      "es": "Agregar nueva ciudad",
      "de": "Neue Stadt hinzufügen"
    },

    LL_LIST_OF_ADDRESSES: {
      "en": "List of Addresses",
      "fr": "Liste des adresses",
      "ru": "Список Адресов",
      "es": "Lista de direcciones",
      "de": "Liste der Adressen"
    },
    
    LL_ADD_NEW_ADDRESS: {
      "en": "Add New Address",
      "fr": "Liste des adresses",
      "ru": "Добавить Новый Адрес",
      "es": "Lista de direcciones",
      "de": "Liste der Adressen"
    },
    
    LL_UPDATE_EXISTING_ADDRESS: {
      "en": "Update Existing Address",
      "fr": "Mettre à jour l'adresse existante",
      "ru": "Редактировать Существующий Адрес",
      "es": "Actualizar dirección existente",
      "de": "Vorhandene Adresse aktualisieren"
    },
     
    LL_LIST_OF_BUSINESS_INFO: {
      "en": "List of Business Units",
      "fr": "Liste des unités commerciales",
      "ru": "Список Бизнес Единиц",
      "es": "Lista de unidades de negocio",
      "de": "Liste der Geschäftsbereiche"
    },
    
    LL_ADD_NEW_BUSINESS_INFO_ENTITY: {
      "en": "Add New Business Unit",
      "fr": "Ajouter une nouvelle unité commerciale",
      "ru": "Добавить Новую Бизнес Единицу",
      "es": "Agregar nueva unidad de negocios",
      "de": "Neuen Geschäftsbereich hinzufügen"
    },
    
    LL_UPDATE_EXISTING_BUSINESS_INFO_ENTITY: {
      "en": "Update Existing Business Unit",
      "fr": "Mettre à jour l'unité commerciale existante",
      "ru": "Редактировать Существующую Бизнес Единицу",
      "es": "Actualizar la unidad de negocio existente",
      "de": "Bestehende Geschäftseinheit aktualisieren"
    },
    
    LL_SHORT_NAME : {
      "en": "Short Name",
      "fr": "Nom court",
      "ru": "Короткое Имя",
      "es": "Nombre corto",
      "de": "Kurzer Name"
    },
      
    LL_PHONE_CODE: {
      "en": "Phone Code",
      "fr": "Code de téléphone",
      "ru": "Телефонный Код",
      "es": "Código de teléfono",
      "de": "Telefoncode"
    },
    
    LL_MANDATORY_FIELD_EMPTY: {
      "en": "Mandatory field cannot be empty.",
      "fr": "Le champ obligatoire ne peut pas être vide.",
      "ru": "Обязательное поле не может быть пустым.",
      "es": "El campo obligatorio no puede estar vacío.",
      "de": "Das Pflichtfeld darf nicht leer sein."
    },
    
    LL_SOME_MANDATORY_FIELDS_EMPTY: {
      "en": "Mandatory fields cannot be empty.",
      "fr": "Les champs obligatoires ne peuvent pas être vides.",
      "ru": "Обязательное поля не могут быть пустыми.",
      "es": "Los campos obligatorios no pueden estar vacíos.",
      "de": "Pflichtfelder dürfen nicht leer sein."
    },
    
    LL_LOGO: {
      "en": "Logo",
      "fr": "Logo",
      "ru": "Лого",
      "es": "Logo",
      "de": "Logo"
    },
    
    LL_SELECT_COUNTRY: {
      "en": "Select Country",
      "fr": "Choisissez le pays",
      "ru": "Выберите Страну",
      "es": "Seleccionar país",
      "de": "Land auswählen"
    },
    
    LL_SELECT_LL_PROVINCE: {
      "en": "Select Province",
      "fr": "Sélectionnez la province",
      "ru": "Выберите Провинцию",
      "es": "Seleccione provincia",
      "de": "Wählen Sie Provinz"
    },
    
    LL_SELECT_LL_STATE: {
      "en": "Select State",
      "fr": "Sélectionnez l'état",
      "ru": "Выберите Штат",
      "es": "Seleccione estado",
      "de": "Staat wählen"
    },
    
    LL_REGION_NAME: {
      "en": "Region Name",
      "fr": "Nom de la région",
      "ru": "Имя Региона",
      "es": "Nombre de región",
      "de": "Regionsname"
    },
    
    LL_PROVINCE: {
      "en": "Province",
      "fr": "Province",
      "ru": "Провинция",
      "es": "Provincia",
      "de": "Provinz"
    },
    
    LL_STATE: {
      "en": "State",
      "fr": "Etat",
      "ru": "Штат",
      "es": "Estado",
      "de": "Zustand"
    },
    
    LL_POSTAL_CODE: {
      "en": "Postal Code",
      "fr": "Code Postal",
      "ru": "Почтовый Код",
      "es": "Código postal",
      "de": "Postleitzahl"
    },
    
    LL_ZIP_CODE: {
      "en": "Zip Code",
      "fr": "Code postal",
      "ru": "Зип Код",
      "es": "Código postal",
      "de": "Postleitzahl"
    },
    
    LL_POSTAL_NAME: {
      "en": "Postal Name",
      "fr": "Nom postal",
      "ru": "Почтовое Имя",
      "es": "Nombre postal",
      "de": "Postname"
    },
    
    LL_ADDR_LINE_1: {
      "en": "Address Line 1",
      "fr": "Adresse 1",
      "ru": "Адрессная Линия 1",
      "es": "Dirección Línea 1",
      "de": "Anschrift Zeile 1"
    },
    
    LL_ADDR_LINE_2: {
      "en": "Address Line 2",
      "fr": "Adresse 2",
      "ru": "Адрессная Линия 2",
      "es": "Dirección Línea 2",
      "de": "Anschrift Zeile 2"
    },
    
    LL_CITY: {
      "en": "City",
      "fr": "Ville",
      "ru": "Город",
      "es": "Ciudad",
      "de": "Stadt"
    },

    LL_REGION_FIELD: {
      "en": "Region Field",
      "fr": "Champ Région",
      "ru": "Поле Региона",
      "es": "Campo de la región",
      "de": "Regionsfeld"
    },

    LL_BUSINESS_INFO: {
      "en": "Business Info",
      "fr": "Info entreprise",
      "ru": "Бизнес Инфо",
      "es": "Información comercial",
      "de": "Geschäftsinformationen"
    },
    
    LL_SITE: {
      "en": "Web Site",
      "fr": "Site Internet",
      "ru": "Веб Сайт",
      "es": "Sitio web",
      "de": "Webseite"
    },

    LL_PHONE: {
      "en": "Phone",
      "fr": "Téléphone",
      "ru": "Телефон",
      "es": "Teléfono",
      "de": "Telefon"
    },

    LL_EMAIL: {
      "en": "Email",
      "fr": "Email",
      "ru": "Эл. Почта",
      "es": "Email",
      "de": "Email"
    },

    LL_ADDRESS: {
      "en": "Address",
      "fr": "Adresse",
      "ru": "Адрес",
      "es": "Habla a",
      "de": "Adresse"
    },

    LL_FAX: {
      "en": "Fax",
      "fr": "Fax",
      "ru": "Факс",
      "es": "Fax",
      "de": "Fax"
    },

    LL_NOTES: {
      "en": "Notes",
      "fr": "Remarques",
      "ru": "Заметки",
      "es": "Notas",
      "de": "Anmerkungen"
    },

    LL_ERROR_REFRESH_ENTITY: {
      "en": "Error Refreshing Entity",
      "fr": "Erreur lors de l'actualisation de l'entité",
      "ru": "Ошибка обновления объекта",
      "es": "Error al actualizar la entidad",
      "de": "Fehler beim Aktualisieren der Entität"
    },

    LL_ADDRESS_FORMATTER: {
      "en": "Address Formatter",
      "fr": "Formateur d'adresse",
      "ru": "Форматирование Адреса",
      "es": "Formateador de direcciones",
      "de": "Adressformatierer"
    },

    LL_ADD_NEW: {
      "en": "Add New",
      "fr": "Ajouter un nouveau",
      "ru": "Добавить новый",
      "es": "Agregar nuevo",
      "de": "Neue hinzufügen"
    },

    LL_CRM: {
      "en": "CRM",
      "fr": "CRM",
      "ru": "CRM",
      "es": "CRM",
      "de": "CRM"
    },

    LL_LEAD: {
      "en": "Potential Client",
      "fr": "Client potentiel",
      "ru": "Потенциальный Контакт",
      "es": "Cliente potencial",
      "de": "Potenziellen Kunden"
    },

    LL_LEADS: {
      "en": "Potential Clients",
      "fr": "Clients potentiels",
      "ru": "Потенциальные Контакты",
      "es": "Clientes potenciales",
      "de": "Potentielle Kunden"
    },

    LL_SELECT_CITY: {
      "en": "Select City",
      "fr": "Sélectionnez une ville",
      "ru": "Выберите Город",
      "es": "Ciudad selecta",
      "de": "Stadt wählen"
    },

    LL_TASKS: {
      "en": "Tasks",
      "fr": "Tâches",
      "ru": "Задачи",
      "es": "Tareas",
      "de": "Aufgaben"
    },

    LL_MY_ACTIVE_QUESTS: {
      "en": "My Active Tasks",
      "fr": "Mes tâches actives",
      "ru": "Мои Активные Задачи",
      "es": "Mis tareas activas",
      "de": "Aktive Aufgaben"
    },

    LL_LIST_OF_MY_ACTIVE_QUESTS: {
      "en": "List of My Active Tasks",
      "fr": "Liste de mes tâches actives",
      "ru": "Список Моих Активных Задач",
      "es": "Lista de mis tareas activas",
      "de": "Liste meiner aktiven Aufgaben"
    },

    LL_ADD_NEW_MY_ACTIVE_QUESTS_ENTITY: {
      "en": "Add New Task",
      "fr": "Ajouter une nouvelle tâche",
      "ru": "Добавить Новую Задачу",
      "es": "Agregar nueva tarea",
      "de": "Neue Aufgabe hinzufügen"
    },

    LL_ADD_NEW_MY_QUESTS_ENTITY: {
      "en": "Add New Task",
      "fr": "Ajouter une nouvelle tâche",
      "ru": "Добавить Новую Задачу",
      "es": "Agregar nueva tarea",
      "de": "Neue Aufgabe hinzufügen"
    },

    LL_UPDATE_EXISTING_MY_ACTIVE_QUESTS_ENTITY: {
      "en": "Update Existing Task",
      "fr": "Mettre à jour la tâche existante",
      "ru": "Обновить Существующую Задачу",
      "es": "Actualizar tarea existente",
      "de": "Vorhandene Aufgabe aktualisieren"
    },

    LL_UPDATE_EXISTING_MY_QUESTS_ENTITY: {
      "en": "Update Existing Task",
      "fr": "Mettre à jour la tâche existante",
      "ru": "Обновить Существующую Задачу",
      "es": "Actualizar tarea existente",
      "de": "Vorhandene Aufgabe aktualisieren"
    },

    "LL_UPDATE_EXISTING_PRIVATE::QUESTS_ENTITY": {
      "en": "Update Existing Task",
      "fr": "Mettre à jour la tâche existante",
      "ru": "Обновить Существующую Задачу",
      "es": "Actualizar tarea existente",
      "de": "Vorhandene Aufgabe aktualisieren"
    },

    LL_LOAD_FAILED: {
      "en": "Load Failed",
      "fr": "Chargement raté",
      "ru": "Неудачная Загрузка",
      "es": "Carga fallida",
      "de": "Ladevorgang gescheitert"
    },

    LL_REGULAR: {
      "en": "Regular",
      "fr": "Régulier",
      "ru": "Обычный",
      "es": "Regular",
      "de": "Regulär"
    },

    LL_TYPE: {
      "en": "Type",
      "fr": "Type",
      "ru": "Тип",
      "es": "Tipo",
      "de": "Art"
    },

    LL_DUE_DATE: {
      "en": "Due Date",
      "fr": "Date d'échéance",
      "ru": "Срок",
      "es": "Fecha de vencimiento",
      "de": "Geburtstermin"
    },

    LL_STATUS: {
      "en": "Status",
      "fr": "Statut",
      "ru": "Статус",
      "es": "Estado",
      "de": "Status"
    },

    LL_STARTED: {
      "en": "Started",
      "fr": "Commencé",
      "ru": "Начата",
      "es": "Iniciada",
      "de": "Gestartet"
    },
    
    LL_ON_HOLD: {
      "en": "On Hold",
      "fr": "En attente",
      "ru": "Отложена",
      "es": "En espera",
      "de": "In Wartestellung"
    },
    
    LL_COMPLETED: {
      "en": "Completed",
      "fr": "Terminé",
      "ru": "Завершена",
      "es": "Terminada",
      "de": "Abgeschlossen"
    },

    LL_CLEAR: {
      "en": "Clear",
      "fr": "Clair",
      "ru": "Очистить",
      "es": "Claro",
      "de": "Klar"
    },

    LL_MY_QUESTS: {
      "en": "All My Tasks",
      "fr": "Toutes mes tâches",
      "ru": "Все Мои Задачи",
      "es": "Todas mis tareas",
      "de": "Alle meine Aufgaben"
    },

    LL_LIST_OF_MY_QUESTS: {
      "en": "List of All My Tasks",
      "fr": "Liste de toutes mes tâches",
      "ru": "Список Всех Моих Задач",
      "es": "Lista de todas mis tareas",
      "de": "Liste aller meiner Aufgaben"
    },

    "LL_PRIVATE::QUESTS": {
      "en": "All Tasks",
      "fr": "Toutes les tâches",
      "ru": "Всех Задачи",
      "es": "Todas las tareas",
      "de": "Alle Aufgaben"
    },

    "LL_LIST_OF_PRIVATE::QUESTS": {
      "en": "All User's Tasks",
      "fr": "Toutes les tâches de l'utilisateur",
      "ru": "Все Пользовательские Задачи",
      "es": "Todas las tareas del usuario",
      "de": "Alle Benutzeraufgaben"
    },

    LL_MAX_255_CHAR: {
      "en": "255 characters max",
      "fr": "255 caractères maximum",
      "ru": "Макс. 255 символов",
      "es": "255 caracteres como máximo",
      "de": "Max. 255 Zeichen"
    },

    LL_QUEST_STATUS_HISTORY_CHANGE: {
      "en": "View history of task status changes",
      "fr": "Afficher l'historique des modifications de l'état des tâches",
      "ru": "Просмотреть историю изменения статуса задачи",
      "es": "Ver el historial de cambios de estado de la tarea",
      "de": "Verlauf der Aufgabenstatusänderungen anzeigen"
    },

    LL_CREATED: {
      "en": "Created",
      "fr": "Établie",
      "ru": "Создана",
      "es": "Creada",
      "de": "Erstellt"
    },

    LL_NEW_F: {
      "en": "New",
      "fr": "Nouvelle",
      "ru": "Новая",
      "es": "Nueva",
      "de": "Neue"
    },

    LL_CRM: {
      "en": "CRM",
      "fr": "CRM",
      "ru": "CRM",
      "es": "CRM",
      "de": "CRM"
    },
    
    LL_MY_LEADS: {
      "en": "My Potential Clients",
      "fr": "Mes clients potentiels",
      "ru": "Мои Потенциальные Клиенты",
      "es": "Mis clientes potenciales",
      "de": "Meine potentiellen Kunden"
    },

    LL_LIST_OF_MY_LEADS: {
      "en": "List of my Potential Clients",
      "fr": "Liste de mes clients potentiels",
      "ru": "Список моих Потенциальные Клиентов",
      "es": "Lista de mis clientes potenciales",
      "de": "Liste meiner potenziellen Kunden"
    },

    LL_ADD_NEW_MY_LEADS_ENTITY: {
      "en": "Add New Potential Client",
      "fr": "Ajouter un nouveau client potentiel",
      "ru": "Добавить Нового Потенциального Клиента",
      "es": "Agregar nuevo cliente potencial",
      "de": "Neuen potenziellen Kunden hinzufügen"
    },

    LL_UPDATE_EXISTING_MY_LEADS_ENTITY: {
      "en": "Update Existing Potential Client",
      "fr": "Mettre à jour le client potentiel existant",
      "ru": "Обновить Существующий Потенциального Клиента",
      "es": "Actualizar cliente potencial existente",
      "de": "Aktualisieren Sie den vorhandenen potenziellen Client"
    },

    LL_CUSTOMER: {
      "en": "Customer",
      "fr": "Client",
      "ru": "Клиент",
      "es": "Cliente",
      "de": "Kunde"
    },

    LL_MY_CUSTOMERS: {
      "en": "My Customers",
      "fr": "Mes clients",
      "ru": "Мои Клиенты",
      "es": "Mis clientes",
      "de": "Meine Kunden"
    },

    LL_LIST_OF_MY_CUSTOMERS: {
      "en": "List of My Customers",
      "fr": "Liste de mes clients",
      "ru": "Список Моих Клиентов",
      "es": "Lista de mis clientes",
      "de": "Liste meiner Kunden"
    },

    LL_ADD_NEW_MY_CUSTOMERS_ENTITY: {
      "en": "Add New Customer",
      "fr": "Ajouter un nouveau client",
      "ru": "Добавить Нового Клиента",
      "es": "Agregar nueva cliente",
      "de": "Neuen Kunden hinzufügen"
    },

    LL_UPDATE_EXISTING_MY_CUSTOMERS_ENTITY: {
      "en": "Update Existing Customer",
      "fr": "Mettre à jour le client existant",
      "ru": "Обновить Существующего Клиента",
      "es": "Actualizar cliente existente",
      "de": "Bestehenden Client aktualisieren"
    },

    LL_ALL_CUSTOMERS: {
      "en": "All Customers",
      "fr": "Tous les clients",
      "ru": "Все Клиенты",
      "es": "Todas las clientas",
      "de": "Alle Kunden"
    },

    LL_LIST_OF_ALL_CUSTOMERS: {
      "en": "List of All Customers",
      "fr": "Liste de tous les clients",
      "ru": "Добавить Нового Клиента",
      "es": "Lista de todas las clientas",
      "de": "Liste aller Kunden"
    },

    LL_UPDATE_EXISTING_ALL_CUSTOMERS_ENTITY: {
      "en": "Update Existing Customer",
      "fr": "Mettre à jour le client existant",
      "ru": "Обновить Сущестующего Клиента",
      "es": "Actualizar cliente existente",
      "de": "Bestehenden Kunden aktualisieren"
    },

    LL_SKYPE_ID: {
      "en": "Skype Id",
      "fr": "Identifiant Skype",
      "ru": "Скайп Имя",
      "es": "Identificación del skype",
      "de": "Skype ID"
    },

    LL_CELL_PHONE: {
      "en": "Cell Phone",
      "fr": "Téléphone portable",
      "ru": "Мобильный Телефон",
      "es": "Teléfono móvil",
      "de": "Handy"
    },

    LL_HOME_PHONE: {
      "en": "Home Phone",
      "fr": "Téléphone fixe",
      "ru": "Домашний Телефон",
      "es": "Teléfono de casa",
      "de": "Festnetztelefon"
    },

    LL_COMPANY: {
      "en": "Company",
      "fr": "Compagnie",
      "ru": "Компания",
      "es": "Empresa",
      "de": "Unternehmen"
    },

    LL_CONFIRMED: {
      "en": "Confirmed",
      "fr": "Confirmé",
      "ru": "Подтвержденный",
      "es": "Confirmado",
      "de": "Bestätigt"
    },

    LL_INACTIVE: {
      "en": "Inactive",
      "fr": "Inactif",
      "ru": "Неактивный",
      "es": "Inactivo",
      "de": "Inaktiv"
    },

    LL_CRM_STATUS_HISTORY_CHANGE: {
      "en": "View history of customer status changes",
      "fr": "Afficher l'historique des changements de statut des clients",
      "ru": "Просмотреть историю изменения статуса клиента",
      "es": "Ver el historial de cambios de estado del cliente",
      "de": "Verlauf der Änderungen des Kundenstatus anzeigen"
    },
    
    LL_SELECT_FIELD_CAT: {
      "en": "Select Field Category",
      "fr": "Sélectionnez la catégorie de champ",
      "ru": "Выбрать Категорию Поля",
      "es": "Seleccionar categoría de campo",
      "de": "Wählen Sie Feldkategorie"
    },

    LL_PERSON: {
      "en": "Person",
      "fr": "La personne",
      "ru": "Индивидуал",
      "es": "Persona",
      "de": "Person"
    },

    LL_OTHER: {
      "en": "Other",
      "fr": "Autre",
      "ru": "Другое",
      "es": "Otra",
      "de": "Andere"
    },

    LL_CRM_OWNER_HISTORY_CHANGE: {
      "en": "View history of customer representative changes",
      "fr": "Afficher l'historique des modifications des représentants clients",
      "ru": "Просмотреть историю изменения представителя заказчика",
      "es": "Ver el historial de cambios del representante del cliente",
      "de": "Verlauf der Änderungen der Kundenvertreter anzeigen"
    },

    LL_CUST_REP: {
      "en": "Customer Representative",
      "fr": "Représentant client",
      "ru": "Представитель Клиента",
      "es": "Representante del cliente",
      "de": "Kunden Vertreter"
    },

    LL_AUTHZ_USER: {
      "en": "Authorized User",
      "fr": "Utilisateur autorisé",
      "ru": "Авторизованный пользователь",
      "es": "Usuario autorizado",
      "de": "Autorisierter Benutzer"
    },

    LL_REG_CUST_CONTACT: {
      "en": "Register contact with Customer",
      "fr": "Enregistrer le contact avec le client",
      "ru": "Зарегистрировать контакт с клиентом",
      "es": "Registrar contacto con el cliente",
      "de": "Registrieren Sie den Kontakt mit dem Kunden"
    },

    LL_COMM_MEDIA: {
      "en": "Communication Media",
      "fr": "Médias de communication",
      "ru": "Средства коммуникации",
      "es": "Medios de comunicación",
      "de": "Kommunikationsmedien"
    },

    LL_HISTORY_CUSTOMER_COMM: {
      "en": "View/Add history of Customer Communications",
      "fr": "Afficher / ajouter l'historique des communications client",
      "ru": "Добавить/Изменить историю отношений с Эаказчиком",
      "es": "Ver / agregar historial de comunicaciones con el cliente",
      "de": "Anzeigen / Hinzufügen des Verlaufs der Kundenkommunikation"
    },

    LL_LAST_CONTACTED: {
      "en": "Last Contacted",
      "fr": "Dernier contact",
      "ru": "Последний раз контактировали",
      "es": "Último contactado",
      "de": "Zuletzt kontaktiert"
    },

    LL_LIST_OF_LL_HISTORY_CUSTOMER_COMM: {
      "en": "List of history of Customer Communications",
      "fr": "Liste de l'historique des communications clients",
      "ru": "Список истории общения с клиентами",
      "es": "Lista del historial de comunicaciones con el cliente",
      "de": "Liste der Geschichte der Kundenkommunikation"
    },

    LL_ADD_NEW_LL_HISTORY_CUSTOMER_COMM_CUST_COMM_HISTORY: {
      "en": "Add new Customer Communication Record",
      "fr": "Ajouter un nouvel enregistrement de communication client",
      "ru": "Добавить новую запись общения с клиентом",
      "es": "Agregar nuevo registro de comunicación con el cliente",
      "de": "Neuen Kundenkommunikationsdatensatz hinzufügen"
    },

    LL_UPDATE_EXISTING_LL_HISTORY_CUSTOMER_COMM_CUST_COMM_HISTORY: {
      "en": "Update Existing Customer Communication Record",
      "fr": "Mettre à jour le dossier de communication client existant",
      "ru": "Обновить сущесвующую запись общения с клиентом",
      "es": "Actualizar el registro de comunicación del cliente existente",
      "de": "Aktualisieren Sie den vorhandenen Kundenkommunikationsdatensatz"
    },

    LL_CHAR_MAX: {
      "en": "characters max",
      "fr": "caractères maximum",
      "ru": "символов макс.",
      "es": "caracteres como máximo",
      "de": "Zeichen max."
    },

    LL_SELECT_CUSTOMER_TYPE: {
      "en": "Select Customer Type",
      "fr": "Sélectionnez le type de client",
      "ru": "Выбрать Тип Клиента",
      "es": "Seleccione el tipo de cliente",
      "de": "Wählen Sie Kundentyp"
    },

    LL_SELECT_BUSINESS_TYPE: {
      "en": "Select Business Type",
      "fr": "Sélectionnez le type d'entreprise",
      "ru": "Выберите Тип Бизнеса",
      "es": "Seleccionar tipo de negocio",
      "de": "Wählen Sie Geschäftstyp"
    },

    LL_SELECT_TASK_CATEGORY: {
      "en": "Select Task Category",
      "fr": "Sélectionnez la catégorie de tâche",
      "ru": "Выберите Категорию Задачи",
      "es": "Seleccionar categoría de tarea",
      "de": "Wählen Sie Aufgabenkategorie"
    },

    LL_CRM_ID: {
      "en": "Crm #",
      "fr": "Crm #",
      "ru": "Crm №",
      "es": "Crm #",
      "de": "Crm #"
    }
    
    /*
    LL_: {
      "en": "",
      "fr": "",
      "ru": "",
      "es": "",
      "de": ""
    }
    */
  });
})(jWebApp);
