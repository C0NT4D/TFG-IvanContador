<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

final class UsuarioController extends AbstractController
{
    private $usuarioRepository;
    private $entityManager;

    public function __construct(UsuarioRepository $usuarioRepository, EntityManagerInterface $entityManager)
    {
        $this->usuarioRepository = $usuarioRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/usuarios', name: 'get_usuarios', methods: ['GET'])]
    public function getUsuarios(): JsonResponse
    {
        $usuarios = $this->usuarioRepository->findAll();

        $data = [];
        foreach ($usuarios as $usuario) {
            $data[] = [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'email' => $usuario->getEmail(),
                'rol' => $usuario->getRol(),
                'fechaRegistro' => $usuario->getFechaRegistro()->format('Y-m-d H:i:s'),
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/usuario/{id}', name: 'get_usuario', methods: ['GET'])]
    public function getUsuario(int $id): JsonResponse
    {
        $usuario = $this->usuarioRepository->find($id);

        if (!$usuario) {
            return $this->json(['message' => 'Usuario no encontrado'], 404);
        }

        return $this->json([
            'id' => $usuario->getId(),
            'nombre' => $usuario->getNombre(),
            'email' => $usuario->getEmail(),
            'rol' => $usuario->getRol(),
            'fechaRegistro' => $usuario->getFechaRegistro()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/usuario', name: 'create_usuario', methods: ['POST'])]
    public function createUsuario(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $usuario = new Usuario();
        $usuario->setNombre($data['nombre']);
        $usuario->setEmail($data['email']);
        $usuario->setContrasena($data['contrasena']);
        $usuario->setRol($data['rol']);
        $usuario->setFechaRegistro(new \DateTimeImmutable());

        $this->entityManager->persist($usuario);
        $this->entityManager->flush();

        return $this->json([
            'id' => $usuario->getId(),
            'nombre' => $usuario->getNombre(),
            'email' => $usuario->getEmail(),
            'rol' => $usuario->getRol(),
            'fechaRegistro' => $usuario->getFechaRegistro()->format('Y-m-d H:i:s'),
        ], 201);
    }

    #[Route('/api/usuario/{id}', name: 'update_usuario', methods: ['PUT'])]
    public function updateUsuario(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $usuario = $this->usuarioRepository->find($id);

        if (!$usuario) {
            return $this->json(['message' => 'Usuario no encontrado'], 404);
        }

        if (isset($data['nombre'])) {
            $usuario->setNombre($data['nombre']);
        }
        
        if (isset($data['email'])) {
            $usuario->setEmail($data['email']);
        }
        
        if (isset($data['contrasena']) && !empty($data['contrasena'])) {
            $usuario->setContrasena($data['contrasena']);
        }
        
        if (isset($data['rol'])) {
            $usuario->setRol($data['rol']);
        }

        $this->entityManager->flush();

        return $this->json([
            'id' => $usuario->getId(),
            'nombre' => $usuario->getNombre(),
            'email' => $usuario->getEmail(),
            'rol' => $usuario->getRol(),
            'fechaRegistro' => $usuario->getFechaRegistro()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/usuario/{id}', name: 'delete_usuario', methods: ['DELETE'])]
    public function deleteUsuario(int $id): JsonResponse
    {
        try {
            $usuario = $this->usuarioRepository->find($id);

            if (!$usuario) {
                return $this->json(['message' => 'Usuario no encontrado'], 404);
            }

            $mensajes = $usuario->getMensajes();
            foreach ($mensajes as $mensaje) {
                $this->entityManager->remove($mensaje);
            }

            $recomendaciones = $usuario->getRecomendacions();
            foreach ($recomendaciones as $recomendacion) {
                $this->entityManager->remove($recomendacion);
            }

            $lecturas = $usuario->getLecturas();
            foreach ($lecturas as $lectura) {
                $this->entityManager->remove($lectura);
            }

            $inscripciones = $usuario->getInscripcions();
            foreach ($inscripciones as $inscripcion) {
                $this->entityManager->remove($inscripcion);
            }

            $eventos = $usuario->getEventos();
            foreach ($eventos as $evento) {
                $this->entityManager->remove($evento);
            }

            $foros = $usuario->getForos();
            foreach ($foros as $foro) {
                $this->entityManager->remove($foro);
            }

            $this->entityManager->remove($usuario);
            $this->entityManager->flush();

            return $this->json(['message' => 'Usuario eliminado con éxito']);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error al eliminar el usuario: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/api/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->json(['message' => 'Email y contraseña son requeridos'], 400);
        }
        
        $email = $data['email'];
        $password = $data['password'];
        
        $usuario = $this->usuarioRepository->findOneBy(['email' => $email]);
        
        if (!$usuario) {
            return $this->json(['message' => 'Usuario no encontrado'], 401);
        }
        
        if ($usuario->getContrasena() !== $password) {
            return $this->json(['message' => 'Contraseña incorrecta'], 401);
        }
        
        return $this->json([
            'id' => $usuario->getId(),
            'nombre' => $usuario->getNombre(),
            'email' => $usuario->getEmail(),
            'rol' => $usuario->getRol(),
            'fechaRegistro' => $usuario->getFechaRegistro()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/usuario/{id}/change-password', name: 'change_password', methods: ['POST'])]
    public function changePassword(int $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
                return $this->json(['message' => 'Se requieren la contraseña actual y la nueva contraseña'], 400);
            }

            $usuario = $this->usuarioRepository->find($id);
            if (!$usuario) {
                return $this->json(['message' => 'Usuario no encontrado'], 404);
            }

            if ($usuario->getContrasena() !== $data['currentPassword']) {
                return $this->json(['message' => 'La contraseña actual es incorrecta'], 401);
            }

            $usuario->setContrasena($data['newPassword']);
            $this->entityManager->flush();

            return $this->json(['message' => 'Contraseña actualizada correctamente']);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error al cambiar la contraseña: ' . $e->getMessage()], 500);
        }
    }
}
