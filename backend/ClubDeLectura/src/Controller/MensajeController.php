<?php

namespace App\Controller;

use App\Entity\Mensaje;
use App\Repository\MensajeRepository;
use App\Repository\ForoRepository;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

final class MensajeController extends AbstractController
{
    private $mensajeRepository;
    private $foroRepository;
    private $usuarioRepository;
    private $entityManager;

    // Inyectamos los repositorios necesarios y el EntityManagerInterface
    public function __construct(
        MensajeRepository $mensajeRepository,
        ForoRepository $foroRepository,
        UsuarioRepository $usuarioRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->mensajeRepository = $mensajeRepository;
        $this->foroRepository = $foroRepository;
        $this->usuarioRepository = $usuarioRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/mensajes', name: 'get_mensajes', methods: ['GET'])]
    public function getMensajes(): JsonResponse
    {
        $mensajes = $this->mensajeRepository->findAll();

        $data = [];
        foreach ($mensajes as $mensaje) {
            $data[] = [
                'id' => $mensaje->getId(),
                'foro' => $mensaje->getForo()->getTitulo(),
                'usuario' => $mensaje->getUsuario()->getNombre(),
                'contenido' => $mensaje->getContenido(),
                'fechaEnvio' => $mensaje->getFechaEnvio()->format('Y-m-d H:i:s'),
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/mensaje/{id}', name: 'get_mensaje', methods: ['GET'])]
    public function getMensaje(int $id): JsonResponse
    {
        $mensaje = $this->mensajeRepository->find($id);

        if (!$mensaje) {
            return $this->json(['message' => 'Mensaje no encontrado'], 404);
        }

        return $this->json([
            'id' => $mensaje->getId(),
            'foro' => $mensaje->getForo()->getTitulo(),
            'usuario' => $mensaje->getUsuario()->getNombre(),
            'contenido' => $mensaje->getContenido(),
            'fechaEnvio' => $mensaje->getFechaEnvio()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/mensaje', name: 'create_mensaje', methods: ['POST'])]
    public function createMensaje(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $foro = $this->foroRepository->find($data['foroId']);
        $usuario = $this->usuarioRepository->find($data['usuarioId']);

        if (!$foro || !$usuario) {
            return $this->json(['message' => 'Foro o usuario no encontrado'], 404);
        }

        $mensaje = new Mensaje();
        $mensaje->setForo($foro);
        $mensaje->setUsuario($usuario);
        $mensaje->setContenido($data['contenido']);
        $mensaje->setFechaEnvio(new \DateTimeImmutable());

        // Persistimos el mensaje
        $this->entityManager->persist($mensaje);
        $this->entityManager->flush();

        return $this->json([
            'id' => $mensaje->getId(),
            'foro' => $mensaje->getForo()->getTitulo(),
            'usuario' => $mensaje->getUsuario()->getNombre(),
            'contenido' => $mensaje->getContenido(),
            'fechaEnvio' => $mensaje->getFechaEnvio()->format('Y-m-d H:i:s'),
        ], 201);
    }

    #[Route('/api/mensaje/{id}', name: 'update_mensaje', methods: ['PUT'])]
    public function updateMensaje(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $mensaje = $this->mensajeRepository->find($id);

        if (!$mensaje) {
            return $this->json(['message' => 'Mensaje no encontrado'], 404);
        }

        $foro = $this->foroRepository->find($data['foroId']);
        $usuario = $this->usuarioRepository->find($data['usuarioId']);

        if (!$foro || !$usuario) {
            return $this->json(['message' => 'Foro o usuario no encontrado'], 404);
        }

        $mensaje->setForo($foro);
        $mensaje->setUsuario($usuario);
        $mensaje->setContenido($data['contenido']);
        $mensaje->setFechaEnvio(new \DateTimeImmutable());

        // Persistimos los cambios
        $this->entityManager->flush();

        return $this->json([
            'id' => $mensaje->getId(),
            'foro' => $mensaje->getForo()->getTitulo(),
            'usuario' => $mensaje->getUsuario()->getNombre(),
            'contenido' => $mensaje->getContenido(),
            'fechaEnvio' => $mensaje->getFechaEnvio()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/mensaje/{id}', name: 'delete_mensaje', methods: ['DELETE'])]
    public function deleteMensaje(int $id): JsonResponse
    {
        $mensaje = $this->mensajeRepository->find($id);

        if (!$mensaje) {
            return $this->json(['message' => 'Mensaje no encontrado'], 404);
        }

        // Eliminar el mensaje
        $this->entityManager->remove($mensaje);
        $this->entityManager->flush();

        return $this->json(['message' => 'Mensaje eliminado con éxito']);
    }
}
