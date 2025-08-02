import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog API Documentation',
            version: '1.0.0',
            description: 'API documentation for Blog Management System',
            contact: {
                name: 'Serge Singizwa',
                email: 'singizwaserge@gmail.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Blog: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Blog unique identifier'
                        },
                        title: {
                            type: 'string',
                            description: 'Blog title'
                        },
                        slug: {
                            type: 'string',
                            description: 'URL-friendly version of the title'
                        },
                        content: {
                            type: 'string',
                            description: 'Blog content'
                        },
                        description: {
                            type: 'string',
                            description: 'Brief description of the blog'
                        },
                        author: {
                            type: 'string',
                            description: 'Email of the author'
                        },
                        isPublished: {
                            type: 'boolean',
                            description: 'Publication status'
                        }
                    }
                },
                Comment: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid'
                        },
                        content: {
                            type: 'string'
                        },
                        userId: {
                            type: 'string',
                            format: 'uuid'
                        },
                        blogId: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                },
                Like: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid'
                        },
                        userId: {
                            type: 'string',
                            format: 'uuid'
                        },
                        blogId: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid'
                        },
                        name: {
                            type: 'string'
                        },
                        email: {
                            type: 'string',
                            format: 'email'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin']
                        },
                        gender: {
                            type: 'string',
                            enum: ['male', 'female', 'other']
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.ts'], 
};

export const specs = swaggerJsdoc(options);
