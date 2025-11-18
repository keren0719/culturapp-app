import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { apiapp } from "@/lib/apiapp";
import { Calendar, MapPin, Upload, X } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

const eventSchema = z.object({
  name: z.string().min(5, "El nombre debe tener al menos 5 caracteres").max(100, "Máximo 100 caracteres"),
  location: z.string().min(1, "Selecciona una ubicación"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres").max(500, "Máximo 500 caracteres"),
  category: z.string().min(1, "Selecciona una categoría"),
  date: z.string().min(1, "Selecciona una fecha"),
  time: z.string().min(1, "Selecciona una hora"),
  capacity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Capacidad debe ser un número positivo"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "El precio debe ser un número válido"),
  photos: z.any().optional(),
  videos: z.any().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}


export function CreateEventDialog({ open, onOpenChange, onSuccess }: CreateEventDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const {user} = useAuth();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiapp.categories.getAll(),
  });

  const { data: places = [] } = useQuery({
    queryKey: ['places'],
    queryFn: () => apiapp.places.getAll(),
  });


  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      category: "",
      date: "",
      time: "",
      capacity: "",
      price: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Formato inválido",
          description: `${file.name} no es una imagen válida`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Archivo muy grande",
          description: `${file.name} supera los 5MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    setPhotoFiles(prev => [...prev, ...validFiles]);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        toast({
          title: "Formato inválido",
          description: `${file.name} no es un video válido`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > MAX_FILE_SIZE * 2) {
        toast({
          title: "Archivo muy grande",
          description: `${file.name} supera los 10MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    setVideoFiles(prev => [...prev, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);

console.log("creado")
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("location", data.location);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("date", data.date);
      formData.append("time", data.time);
      formData.append("capacity", data.capacity);
      formData.append("price", data.price);
      formData.append("user", user?.id);

      photoFiles.forEach((file) => {
        formData.append("photos", file);
      });

      videoFiles.forEach((file) => {
        formData.append("videos", file);
      });


        const result = await apiapp.events.create(formData);

        toast({
            title: "Éxito",
            description: "El evento fue creado correctamente.",
        });

      form.reset();
      setPhotoFiles([]);
      setVideoFiles([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) 
    {
      toast({
        title: "Error",
        description: "No se pudo crear el evento. Intenta nuevamente",
        variant: "destructive",
      });
    } finally 
    {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Crear Nuevo Evento</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Completa el formulario para crear un evento cultural. Será revisado antes de publicarse.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Evento *</FormLabel>
                  <FormControl>
                    <Input placeholder="Festival de Jazz en la Plaza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border z-50">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
            control={form.control}
            name="location"
            render={({ field }) => {
                const [filter, setFilter] = useState("");

                const filteredPlaces = places.filter((place) =>
                `${place.nombre} ${place.ciudad || ""}`
                    .toLowerCase()
                    .includes(filter.toLowerCase())
                );

                return (
                <FormItem>
                    <FormLabel>Ubicación *</FormLabel>

                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecciona una ubicación" />
                        </SelectTrigger>
                    </FormControl>

                    <SelectContent className="bg-popover border-border z-50">

                        {/* Campo de búsqueda dentro del Select */}
                        <div className="p-2 sticky top-0 bg-popover z-50 border-b">
                        <Input
                            placeholder="Buscar ubicación..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        </div>

                        {/* Lista filtrada */}
                        {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place) => (
                            <SelectItem
                            key={place.id}
                            value={place.id.toString()}
                            >
                            {place.nombre} {place.ciudad ? `– ${place.ciudad}` : ""}
                            </SelectItem>
                        ))
                        ) : (
                        <div className="p-3 text-sm text-muted-foreground">
                            Sin resultados
                        </div>
                        )}
                    </SelectContent>
                    </Select>

                    <FormMessage />
                </FormItem>
                );
            }}
            />



            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input type="date" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu evento cultural..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (COP) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormItem>
                <FormLabel>Fotos del Evento</FormLabel>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Fotos
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Máximo 5MB por archivo
                  </span>
                </div>
                {photoFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {photoFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md"
                      >
                        <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Videos del Evento</FormLabel>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Videos
                      <input
                        type="file"
                        multiple
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoChange}
                      />
                    </label>
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Máximo 10MB por archivo
                  </span>
                </div>
                {videoFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {videoFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md"
                      >
                        <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => removeVideo(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </FormItem>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando..." : "Crear Evento"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
