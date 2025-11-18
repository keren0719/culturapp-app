// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { useAuth } from '@/lib/auth';
// import { api } from '@/lib/api';
// import { useToast } from '@/hooks/use-toast';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     try {
//       // Simulate OAuth flow - in real app, this would redirect to Google OAuth
//       const mockToken = 'google-oauth-token';
//       const response = await api.auth.loginWithGoogle(mockToken);
//       login(response.user, response.token);
//       toast({
//         title: '¡Bienvenido!',
//         description: 'Has iniciado sesión correctamente',
//       });
//       navigate('/');
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'No se pudo iniciar sesión con Google',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFacebookLogin = async () => {
//     setLoading(true);
//     try {
//       const mockToken = 'facebook-oauth-token';
//       const response = await api.auth.loginWithFacebook(mockToken);
//       login(response.user, response.token);
//       toast({
//         title: '¡Bienvenido!',
//         description: 'Has iniciado sesión correctamente',
//       });
//       navigate('/');
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'No se pudo iniciar sesión con Facebook',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // return (
//   //   <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
//   //     <Card className="w-full max-w-md shadow-medium">
//   //       <CardHeader className="text-center">
//   //         <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
//   //           C
//   //         </div>
//   //         <CardTitle className="text-2xl">Bienvenido a CulturApp</CardTitle>
//   //         <CardDescription>
//   //           Inicia sesión para explorar eventos culturales en Cartagena
//   //         </CardDescription>
//   //       </CardHeader>

//   //       <CardContent className="space-y-4">
//   //         <Button
//   //           onClick={handleGoogleLogin}
//   //           disabled={loading}
//   //           variant="outline"
//   //           className="w-full h-12 text-base"
//   //         >
//   //           <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//   //             <path
//   //               fill="currentColor"
//   //               d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//   //             />
//   //             <path
//   //               fill="currentColor"
//   //               d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//   //             />
//   //             <path
//   //               fill="currentColor"
//   //               d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//   //             />
//   //             <path
//   //               fill="currentColor"
//   //               d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//   //             />
//   //           </svg>
//   //           Continuar con Google
//   //         </Button>

//   //         <Button
//   //           onClick={handleFacebookLogin}
//   //           disabled={loading}
//   //           variant="outline"
//   //           className="w-full h-12 text-base"
//   //         >
//   //           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//   //             <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//   //           </svg>
//   //           Continuar con Facebook
//   //         </Button>

//   //         <div className="relative">
//   //           <div className="absolute inset-0 flex items-center">
//   //             <span className="w-full border-t" />
//   //           </div>
//   //           <div className="relative flex justify-center text-xs uppercase">
//   //             <span className="bg-card px-2 text-muted-foreground">O</span>
//   //           </div>
//   //         </div>

//   //         <p className="text-sm text-center text-muted-foreground">
//   //           Las credenciales OAuth son placeholders para desarrollo.
//   //           <br />
//   //           En producción, configura VITE_GOOGLE_CLIENT_ID y VITE_FACEBOOK_APP_ID.
//   //         </p>
//   //       </CardContent>

//   //       <CardFooter className="flex flex-col gap-4">
//   //         <p className="text-sm text-center text-muted-foreground">
//   //           ¿No tienes cuenta?{' '}
//   //           <Link to="/register" className="text-primary font-medium hover:underline">
//   //             Regístrate aquí
//   //           </Link>
//   //         </p>
//   //       </CardFooter>
//   //     </Card>
//   //   </div>
//   // );

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
//       <Card className="w-full max-w-md shadow-medium">
//         <CardHeader className="text-center">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
//             C
//           </div>
//           <CardTitle className="text-2xl">Bienvenido a CulturApp</CardTitle>
//           <CardDescription>
//             Inicia sesión para explorar eventos culturales en Cartagena
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <Label htmlFor="email">Correo electrónico</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="tuemail@ejemplo.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="password">Contraseña</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="********"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <Button type="submit" disabled={loading} className="w-full h-12 text-base">
//               {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
//             </Button>
//           </form>
//         </CardContent>

//         <CardFooter className="flex flex-col gap-4">
//           <p className="text-sm text-center text-muted-foreground">
//             ¿No tienes cuenta?{' '}
//             <Link to="/register" className="text-primary font-medium hover:underline">
//               Regístrate aquí
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default Login;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Asegúrate de tener este componente
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const API_BASE = import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const LOGIN_ENDPOINT = `${API_BASE}/users/loginUser`;

  const payload = {
    email: formData.email,
    password: formData.password,
  };

  try {
    const res = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Intentar leer la respuesta como JSON
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg =
        data?.detail?.message ||
        data?.message ||
        'Error en el inicio de sesión';
      toast({
        title: 'Error',
        description: msg,
        variant: 'destructive',
      });
      throw new Error(msg);
    }

    // Éxito
    const { user, token } = data.payload || {};
    if (user && token) {
      login(user, token); // Guarda sesión
      toast({
        title: '¡Bienvenido!',
        description: data.detail?.message || 'Inicio de sesión exitoso',
      });
      navigate('/');
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
  } catch (error) {
    console.log(error);
    toast({
      title: 'Error',
      description:
        error.message || 'No se pudo conectar con el servidor',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
            C
          </div>
          <CardTitle className="text-2xl">Bienvenido a CulturApp</CardTitle>
          <CardDescription>
            Inicia sesión para explorar eventos culturales en Cartagena
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tuemail@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 text-base">
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-center text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
