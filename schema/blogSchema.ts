import Joi from "joi";


export const CreateBlogSchema= Joi.object({
    title:Joi.string(),
    slug:Joi.string(),
    description:Joi.string(),
    content:Joi.string(),
    author:Joi.string(),
    isPublished:Joi.boolean().optional(),
    createdAt:Joi.date().optional(),
    updatedAt:Joi.date().optional(), 
    deletedAt:Joi.date().optional()
  

});
export const UpdateBlogSchema= Joi.object({
    title:Joi.string().optional(),
    slug:Joi.string().optional(),
    description:Joi.string().optional(),
    content:Joi.string().optional(), 
    author:Joi.string().optional(),
    isPublished:Joi.boolean().optional(),
    
    updatedAt:Joi.date().optional(),
    deletedAt:Joi.date().optional()
});

export  const IdValidationSchema =Joi.object({
    id:Joi.string().min(24)
}
)


