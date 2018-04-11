export const template =
{
    "type": "view",
    "perspectives": [
        {
            "id": 0,
            "id-field": "id",
            "data": {
                "cache": "site-lookup",
                "aggregate": "count",
                "sorting": ["code"]
            },
            "views": [
                {
                    "id": 0,
                    "name": "Standard Grid Layout",
                    "type":"grid",
                    "columns": [
                        {
                            "field": "code",
                            "title": "Code",
                            "width": "120px"
                        },
                        {
                            "field": "description",
                            "title": "Description",
                            "width": "1fr"
                        }
                    ]
                }
            ]
        }
    ],
    "lookups": [
        {
            "id": 0,
            "name": "Site Lookup",
            "mapping": {
                "siteCode": "code",
            },
            "perspective": 0,
            "view": 0,
            "remote": "site-resource"
        }
    ],
    "datasets": [
        {
            "id": 0,
            "name": "model",
            "fields": [
                {
                    "name": "id",
                    "default": -1
                },
                {
                    "name": "code",
                    "validations": [
                        {
                            "type": "default",
                            "rules": {
                                "required": true
                            }
                        }
                    ]

                },
                {
                    "name": "description",
                    "validations": [
                        {
                            "type": "default",
                            "rules": {
                                "required": true,
                                "minLength": 5,
                                "maxLength": 100
                            }
                        }
                    ]
                },
                {
                    "name": "siteCode",
                    "lookup": 0,
                    "validations": [
                        {
                            "type": "default",
                            "rules": {
                                "required": true
                            }
                        }
                    ]
                },
                {
                    "name": "locationCode",
                    "validations": [
                        {
                            "type": "default",
                            "rules": {
                                "required": true
                            }
                        }
                    ]
                },
                {
                    "name": "condition",
                    "default": 1
                }
            ]
        }
    ],
    "datasources": [
        {
            "id": 0,
            "resource": [
                {
                    "id": 0,
                    "title": "Excellent"
                },
                {
                    "id": 1,
                    "title": "Good"
                },
                {
                    "id": 2,
                    "title": "Average"
                },
                {
                    "id": 3,
                    "title": "Bad"
                }
            ]
        }
    ],
    "templates": [
        {
            "id": 0,
            "elements": [
                {
                    "element": "readonly",
                    "title": "id",
                    "field": "model.id"
                },
                {
                    "element": "input",
                    "title": "Code",
                    "field": "model.code"
                },
                {
                    "element": "input",
                    "title": "Description",
                    "field": "model.description"
                },
                {
                    "element": "input",
                    "title": "Site",
                    "field": "model.siteCode"
                },
                {
                    "element": "input",
                    "title": "Location",
                    "field": "model.locationCode"
                },
                {
                    "element": "select",
                    "datasource": 0,
                    "title": "Condition",
                    "field": "model.condition"
                },
            ]
        },
        {
            "id": 1,
            "elements": [
                {
                    "element": "div",
                    "content": "${item.code}"
                },
                {
                    "element": "div",
                    "content": "${item.description}",
                    "styles": ["suppressed"]
                }
            ]
        }
    ],
    "body": {
        "elements": [
            {
                "element": "master-detail",
                "attributes": {
                    "is-master-visible.bind": "context.isMasterVisible"
                },
                "master": [
                    {
                        "element": "list",
                        "datasource": "context.items",
                        "template": 1,
                        "change-model": false,
                        "selection-field": "context.selectedId"
                    }
                ],
                "detail": [
                    {
                        "element": "template",
                        "template": 0
                    }
                ]
            }
        ]
    }
};
