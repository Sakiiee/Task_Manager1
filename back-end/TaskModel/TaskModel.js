const Tasklogin= require('mongoose');

const login = new Tasklogin.Schema({

    title: { 
        type: String, 
        required: true 
        },

        description: { 
            type: String, 
            required: true
         },
    
         dueDate: { 
            type: Date, 
            required: true 
        },
        status: { type: String, 
            enum: ['pending', 'in-progress', 'completed'], 
            default: 'pending'
         }

})

module.exports=Tasklogin.model('TaskMod',login)
