import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Alert, 
  Snackbar, 
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  idUsuario: string | null;
  nombres: string;
  apellidos: string;
  email: string;
}

const Formulario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialUserState: User = {
    idUsuario: null,
    nombres: '',
    apellidos: '',
    email: ''
  };

  const [user, setUser] = useState<User>(initialUserState);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Cargar la lista de usuarios para el selector de actualización
  useEffect(() => {
    setFetchingUsers(true);
    fetch('http://localhost:8000/usuarios')
      .then(response => response.json())
      .then(data => {
        if (data && data.data) {
          setUserList(data.data);
        }
        setFetchingUsers(false);
      })
      .catch(error => {
        console.error('Error al cargar usuarios:', error);
        setFetchingUsers(false);
      });
  }, []);

  // Verificar si llegamos a través de un enlace "editar" con datos
  useEffect(() => {
    if (location.state && location.state.userToEdit) {
      setUser(location.state.userToEdit);
      setIsEditing(true);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleUserSelect = (e: SelectChangeEvent<string>) => {
    const userId = e.target.value;
    if (userId === '') {
      // Si selecciona "Crear nuevo usuario", resetear el formulario
      setUser(initialUserState);
      setIsEditing(false);
      return;
    }
    
    // Buscar el usuario seleccionado en la lista
    const selectedUser = userList.find(u => u.idUsuario === userId);
    if (selectedUser) {
      setUser(selectedUser);
      setIsEditing(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // URL es la misma para POST y PUT según tu API
    const url = 'http://localhost:8000/usuarios';
    const method = isEditing ? 'PUT' : 'POST';

    // IMPORTANTE: Solo verificamos campos obligatorios en modo creación
    if (!isEditing) {
      // Validación solo para modo de registro, no para actualización
      if (!user.nombres || !user.apellidos || !user.email) {
        showNotification('Todos los campos son obligatorios para registrar un nuevo usuario', 'error');
        setLoading(false);
        return;
      }
    }

    // Estructura del body según tu API
    let requestBody: any = {};
    
    if (isEditing) {
      // En modo edición, el idUsuario es obligatorio pero los demás campos son opcionales
      requestBody = {
        idUsuario: user.idUsuario
      };
      
      // Solo incluimos los campos que tienen valor
      if (user.nombres !== '') requestBody.nombres = user.nombres;
      if (user.apellidos !== '') requestBody.apellidos = user.apellidos;
      if (user.email !== '') requestBody.email = user.email;
    } else {
      // En modo creación, incluimos todos los campos
      requestBody = {
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email
      };
    }

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json();
    })
    .then(() => {
      showNotification(
        isEditing ? 'Usuario actualizado con éxito' : 'Usuario registrado con éxito',
        'success'
      );
      
      // Redireccionar al inicio después de un registro exitoso
      setTimeout(() => {
        navigate('/');
      }, 1000); // Esperamos 1 segundo para que el usuario vea la notificación
    })
    .catch(error => {
      console.error('Error:', error);
      showNotification('Error al guardar el usuario', 'error');
      setLoading(false);
    });
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Gestión de Usuario
        </Typography>

        {/* Selector de usuario para actualizar */}
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="user-select-label">Seleccione usuario para actualizar</InputLabel>
          <Select
            labelId="user-select-label"
            id="user-select"
            value={isEditing && user.idUsuario ? user.idUsuario : ''}
            label="Seleccione usuario para actualizar"
            onChange={handleUserSelect}
            disabled={fetchingUsers || loading}
          >
            <MenuItem value="">
              <em>Crear nuevo usuario</em>
            </MenuItem>
            {userList.map((userItem) => (
              <MenuItem key={userItem.idUsuario} value={userItem.idUsuario || ''}>
                {userItem.nombres} {userItem.apellidos} ({userItem.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          {/* Campo de ID oculto - mantenemos la funcionalidad pero sin mostrar el campo */}
          {isEditing && user.idUsuario && (
            <input type="hidden" name="idUsuario" value={user.idUsuario} />
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required={!isEditing}
                fullWidth
                label="Nombres"
                name="nombres"
                value={user.nombres}
                onChange={handleChange}
                variant="outlined"
                autoFocus={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required={!isEditing}
                fullWidth
                label="Apellidos"
                name="apellidos"
                value={user.apellidos}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required={!isEditing}
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isEditing ? 'Actualizar' : 'Registrar'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Formulario;