import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.string().nonempty('Debes seleccionar un rol'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [rol, setRol] = useState(""); 
  const [roles, setRoles] = useState<{ Id: number; Nombre: string }[]>([]);
  const [loading, setLoading] = useState(false);
  
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '',
    },
  });

  // const onSubmit = async (data: RegisterFormData) => {
  //   setLoading(true);
  //   try {
  //     const response = await api.auth.register({
  //       email: data.email,
  //       password: data.password,
  //       name: data.name,
  //       role: data.role,
  //     });
  //     login(response.user, response.token);
  //     toast({
  //       title: '¡Cuenta creada!',
  //       description: 'Tu registro se completó exitosamente',
  //     });
  //     navigate('/');
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: 'No se pudo crear la cuenta',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // === CARGAR ROLES DEL BACKEND ===
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_BASE}/roles/getAllRoles`);
        if (!res.ok) throw new Error("Error al obtener los roles");
        const data = await res.json();
        setRoles(data);
        if (data.length > 0) form.setValue("role", data[0].Id.toString());
      } catch (err) {
        console.log(err);
        toast({
          title: "Error",
          description: "No se pudieron cargar los roles.",
          variant: "destructive",
        });
      }
    };
    fetchRoles();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        rol: data.role, // el backend espera "rol"
      };

      const res = await fetch(`${API_BASE}/users/createUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          responseData?.message || "No se pudo crear la cuenta correctamente.";
        throw new Error(msg);
      }

      toast({
        title: "¡Cuenta creada!",
        description: "Tu registro se completó exitosamente.",
      });

      navigate("/login");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Error desconocido al registrar usuario.",
        variant: "destructive",
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
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Únete a CulturApp y comienza a disfrutar de eventos culturales
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ROL DINÁMICO DESDE BACKEND */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecciona tu rol</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="">Selecciona un rol</option>
                        {roles.map((r) => (
                          <option key={r.Id} value={r.Id}>
                            {r.Nombre}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Nota:</strong> Los roles de administrador requieren una invitación especial.
                  Si necesitas acceso administrativo, contacta al equipo.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Registrarse'}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
