# PropertyMap
__Api creada en [express.js](https://expressjs.com/) a partir de la api creada en [GO](https://golang.org/) para control de propiedades. Parte de servidor__  
   

## Librerías externas utilizadas:
    "bcrypt": "^5.0.0"   
    "cors": "^2.8.5"   
    "dotenv": "^8.2.0"   
    "express": "^4.17.1"   
    "express-validator": "^6.8.0"
    "jsonwebtoken": "^8.5.1"   
    "morgan": "^1.10.0"   
    "multer": "^1.4.2"
    "node-cache": "^5.1.2"
    "pg": "^8.5.1"
    "pg-hstore": "^2.3.3"
    "sequelize": "^6.3.5"
    "sharp": "^0.26.3"
    "uuid": "^8.3.1"
     

## Estructura de la api  

### Users  
Perfiles de usuario con roles (anonymous/user/admin)   
   
"/users"              - __post__ - Registro de usuarios, encripta los passwords con SHA256  
"/users/login"        - __post__ - Login de usuario  
"/users"              - __get__  - Listado de todos los usuarios, solo para administradores  
"/users/{id:[0-9]+}"  - __get__  - Detalles de un usuario en concreto  
"/users/{id:[0-9]+"   - __put__  - Editar un usuario. No se puede cambiar ID ni username. El role solo lo puede cambiar un admin  

#### Roles  
__admin__: Tiene control sobre todo, menos para crear contenido como si fuera otro usuario. Puede borrar y editar lo que suben los demás.   
__user__: No puede listar todos los usuarios ni borrar o editar el contenido de los otros usuarios.  
__anonymous(u otros)__: Usuario de prueba. Solamente puede editar su propia información   


### Owners   
Propietarios de los edificios   
   
"/owners"              - __post__   - Creación de propietarios, solo para administradores    
"/owners"              - __get__    - Listado de todos los propietarios   
"/owners/{id:[0-9]+}"  - __get__    - Detalles de un propietario en concreto   
"/owners/{id:[0-9]+"   - __put__    - Editar un propietario. No se puede cambiar ID ni fecha de creación     
"/owners/{id:[0-9]+"   - __delete__ - Borra un propietario, solo para administradores   
   
### Okupas   
   
Perfiles de las asociaciones okupa   
   
"/okupas"              - __post__   - Creación de asociaciones, solo para administradores    
"/okupas"              - __get__    - Listado de todas las asociaciones   
"/okupas/{id:[0-9]+}"  - __get__    - Detalles de una asociación en concreto   
"/okupas/{id:[0-9]+"   - __put__    - Editar una asociación. No se puede cambiar ID ni fecha de creación     
"/okupas/{id:[0-9]+"   - __delete__ - Borra una asociación, solo para administradores  
    
### UserOkupa   
   
Relación entre usuarios y asociaciones okupas   
   
"/okupas/{id:[0-9]+}/{usr:[0-9]+}"  - __post__     Añadir un usuario a una asociación okupa   
"/okupas/{id:[0-9]+}/{usr:[0-9]+}"  - __delete__   Elimina el usuario de la asociación okupa   
"/okupas/users/{id:[0-9]+}"         - __get__      Lista los usuarios de una asociación okupa   
   
### Properties   

Registro de las propiedades/edificios   
   
"/properties"                    - __post__   - Dar de alta propiedades, solo para administradores    
"/properties"                    - __get__    - Listado de todas las propiedades    
"/properties/{id:[0-9]+}"        - __get__    - Detalles de una propiedad en concreto   
"/properties/{id:[0-9]+"         - __put__    - Editar una propiedad. No se puede cambiar ID ni fecha de creación. Solo administradores     
"/properties/{id:[0-9]+"         - __delete__ - Borra una propiedad, solo para administradores   
"/properties/users/{id:[0-9]+}"  - __get__    - Listado de propiedades por usuario   
"/properties/types/{id:[0-9]+}"  - __get__    - Listado de propiedades por tipo   
"/properties/owners/{id:[0-9]+}" - __get__    - Listado de propiedades por propietario   
"/properties/okupas/{id:[0-9]+}" - __get__    - Listado de propiedades por asociación    
   
#### Donaciones    
    
<a href="https://www.buymeacoffee.com/yeadan" target="_blank"><img src="https://github.com/yeadan/blockenergy/blob/master/public/default-orange.png" alt="Buy Me A Coffee" style="height: 26px !important;width: 109px !important;" ></a>   
   
BTC: 32kZW9Z381DDPn54Sho8U5jQ53UhLC8rTv   