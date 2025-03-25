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

    // Inyectamos el UsuarioRepository y EntityManagerInterface en el constructor
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

        // Persistimos el usuario y hacemos flush
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

        $usuario->setNombre($data['nombre']);
        $usuario->setEmail($data['email']);
        $usuario->setContrasena($data['contrasena']);
        $usuario->setRol($data['rol']);

        // Hacemos flush para guardar los cambios
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
        $usuario = $this->usuarioRepository->find($id);

        if (!$usuario) {
            return $this->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Eliminar el usuario de la base de datos
        $this->entityManager->remove($usuario);
        $this->entityManager->flush();

        return $this->json(['message' => 'Usuario eliminado con éxito']);
    }
}
