<?php

namespace App\Controller;

use App\Entity\Lectura;
use App\Repository\LecturaRepository;
use App\Repository\UsuarioRepository;
use App\Repository\LibroRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

final class LecturaController extends AbstractController
{
    private $lecturaRepository;
    private $usuarioRepository;
    private $libroRepository;
    private $entityManager;

    // Inyectamos los repositorios necesarios y el EntityManagerInterface
    public function __construct(
        LecturaRepository $lecturaRepository,
        UsuarioRepository $usuarioRepository,
        LibroRepository $libroRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->lecturaRepository = $lecturaRepository;
        $this->usuarioRepository = $usuarioRepository;
        $this->libroRepository = $libroRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/lecturas', name: 'get_lecturas', methods: ['GET'])]
    public function getLecturas(): JsonResponse
    {
        $lecturas = $this->lecturaRepository->findAll();

        $data = [];
        foreach ($lecturas as $lectura) {
            $data[] = [
                'id' => $lectura->getId(),
                'usuario' => $lectura->getUsuario()->getNombre(),
                'libro' => $lectura->getLibro()->getTitulo(),
                'estadoLectura' => $lectura->getEstadoLectura(),
                'fechaInicio' => $lectura->getFechaInicio()->format('Y-m-d'),
                'fechaFin' => $lectura->getFechaFin() ? $lectura->getFechaFin()->format('Y-m-d') : null,
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/lectura/{id}', name: 'get_lectura', methods: ['GET'])]
    public function getLectura(int $id): JsonResponse
    {
        $lectura = $this->lecturaRepository->find($id);

        if (!$lectura) {
            return $this->json(['message' => 'Lectura no encontrada'], 404);
        }

        return $this->json([
            'id' => $lectura->getId(),
            'usuario' => $lectura->getUsuario()->getNombre(),
            'libro' => $lectura->getLibro()->getTitulo(),
            'estadoLectura' => $lectura->getEstadoLectura(),
            'fechaInicio' => $lectura->getFechaInicio()->format('Y-m-d'),
            'fechaFin' => $lectura->getFechaFin() ? $lectura->getFechaFin()->format('Y-m-d') : null,
        ]);
    }

    #[Route('/api/lectura', name: 'create_lectura', methods: ['POST'])]
    public function createLectura(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $usuario = $this->usuarioRepository->find($data['usuarioId']);
        $libro = $this->libroRepository->find($data['libroId']);

        if (!$usuario || !$libro) {
            return $this->json(['message' => 'Usuario o libro no encontrado'], 404);
        }

        $lectura = new Lectura();
        $lectura->setUsuario($usuario);
        $lectura->setLibro($libro);
        $lectura->setEstadoLectura($data['estadoLectura']);
        $lectura->setFechaInicio(new \DateTimeImmutable($data['fechaInicio']));
        $lectura->setFechaFin($data['fechaFin'] ? new \DateTimeImmutable($data['fechaFin']) : null);

        // Persistimos la lectura
        $this->entityManager->persist($lectura);
        $this->entityManager->flush();

        return $this->json([
            'id' => $lectura->getId(),
            'usuario' => $lectura->getUsuario()->getNombre(),
            'libro' => $lectura->getLibro()->getTitulo(),
            'estadoLectura' => $lectura->getEstadoLectura(),
            'fechaInicio' => $lectura->getFechaInicio()->format('Y-m-d'),
            'fechaFin' => $lectura->getFechaFin() ? $lectura->getFechaFin()->format('Y-m-d') : null,
        ], 201);
    }

    #[Route('/api/lectura/{id}', name: 'update_lectura', methods: ['PUT'])]
    public function updateLectura(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $lectura = $this->lecturaRepository->find($id);

        if (!$lectura) {
            return $this->json(['message' => 'Lectura no encontrada'], 404);
        }

        $usuario = $this->usuarioRepository->find($data['usuarioId']);
        $libro = $this->libroRepository->find($data['libroId']);

        if (!$usuario || !$libro) {
            return $this->json(['message' => 'Usuario o libro no encontrado'], 404);
        }

        $lectura->setUsuario($usuario);
        $lectura->setLibro($libro);
        $lectura->setEstadoLectura($data['estadoLectura']);
        $lectura->setFechaInicio(new \DateTimeImmutable($data['fechaInicio']));
        $lectura->setFechaFin($data['fechaFin'] ? new \DateTimeImmutable($data['fechaFin']) : null);

        // Persistimos los cambios
        $this->entityManager->flush();

        return $this->json([
            'id' => $lectura->getId(),
            'usuario' => $lectura->getUsuario()->getNombre(),
            'libro' => $lectura->getLibro()->getTitulo(),
            'estadoLectura' => $lectura->getEstadoLectura(),
            'fechaInicio' => $lectura->getFechaInicio()->format('Y-m-d'),
            'fechaFin' => $lectura->getFechaFin() ? $lectura->getFechaFin()->format('Y-m-d') : null,
        ]);
    }

    #[Route('/api/lectura/{id}', name: 'delete_lectura', methods: ['DELETE'])]
    public function deleteLectura(int $id): JsonResponse
    {
        $lectura = $this->lecturaRepository->find($id);

        if (!$lectura) {
            return $this->json(['message' => 'Lectura no encontrada'], 404);
        }

        // Eliminar la lectura
        $this->entityManager->remove($lectura);
        $this->entityManager->flush();

        return $this->json(['message' => 'Lectura eliminada con éxito']);
    }
}
