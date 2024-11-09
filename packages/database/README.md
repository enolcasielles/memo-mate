# Crear una nueva migración
pnpx prisma migrate dev --name NAME

# Aplicar migraciones pendientes en producción
pnpx prisma migrate deploy

# Ver el estado de las migraciones
pnpx prisma migrate status

# Restablecer la base de datos (¡cuidado! borra todos los datos)
pnpx prisma migrate reset

# Regenerar el cliente de Prisma
pnpx prisma generate
