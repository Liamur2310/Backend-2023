const isAdmin = (req, res, next) => {
    // Verificar si el usuario es administrador
    if (req.user && req.user.role === 'admin') {
        next(); // Permitir acceso al siguiente middleware o ruta
    } else {
        res.status(403).json({ error: 'Unauthorized access' }); // Devolver error de acceso no autorizado
    }
};

const isUser = (req, res, next) => {
    // Verificar si el usuario es un usuario normal
    if (req.user && req.user.role === 'user') {
        next(); // Permitir acceso al siguiente middleware o ruta
    } else {
        res.status(403).json({ error: 'Unauthorized access' }); // Devolver error de acceso no autorizado
    }
};

const authorizationMiddleware = {
    isAdmin,
    isUser
};

export default authorizationMiddleware;
