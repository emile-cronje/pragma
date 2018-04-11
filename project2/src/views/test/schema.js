export const template =
{
    "type": "view",
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
                    "default": "Default Code",
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
                    "default": "Default Description",
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
                    "name": "contactFirstName"
                },
                {
                    "name": "contactLastName"
                },
                {
                    "name": "contactInitials"
                },
                {
                    "name": "contactJobTitle"
                }
            ]
        }
    ],
    "body": {
        "elements": [
            {
                "element": "readonly",
                "field": "model.id",
                "title": "Id"
            },
            {
                "element": "input",
                "field": "model.code",
                "title": "Code"
            },
            {
                "element": "input",
                "field": "model.description",
                "title": "Description"
            },
            {
                "element": "input",
                "field": "model.contactFirstName",
                "title": "First Name"
            },
            {
                "element": "input",
                "field": "model.contactLastName",
                "title": "Last Name"
            },
            {
                "element": "input",
                "field": "model.contactInitials",
                "title": "Initials"
            },
            {
                "element": "input",
                "field": "model.contactJobTitle",
                "title": "Title"
            }
        ]
    }
};
