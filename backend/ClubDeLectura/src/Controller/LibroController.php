<?php

namespace App\Controller;

use App\Entity\Libro;
use App\Repository\LibroRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

final class LibroController extends AbstractController
{
    private $libroRepository;
    private $entityManager;

    public function __construct(LibroRepository $libroRepository, EntityManagerInterface $entityManager)
    {
        $this->libroRepository = $libroRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/libros', name: 'get_libros', methods: ['GET'])]
    public function getLibros(): JsonResponse
    {
        $libros = $this->libroRepository->findAll();

        $data = [];
        foreach ($libros as $libro) {
            $data[] = [
                'id' => $libro->getId(),
                'titulo' => $libro->getTitulo(),
                'autor' => $libro->getAutor(),
                'genero' => $libro->getGenero(),
                'anioPublicacion' => $libro->getAnioPublicacion(),
                'sinopsis' => $libro->getSinopsis(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/libro/{id}', name: 'get_libro', methods: ['GET'])]
    public function getLibro(int $id): JsonResponse
    {
        $libro = $this->libroRepository->find($id);

        if (!$libro) {
            throw new NotFoundHttpException('Libro no encontrado');
        }

        return $this->json([
            'id' => $libro->getId(),
            'titulo' => $libro->getTitulo(),
            'autor' => $libro->getAutor(),
            'genero' => $libro->getGenero(),
            'anioPublicacion' => $libro->getAnioPublicacion(),
            'sinopsis' => $libro->getSinopsis(),
        ]);
    }

    #[Route('/api/libro', name: 'create_libro', methods: ['POST'])]
    public function createLibro(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $libro = new Libro();
        $libro->setTitulo($data['titulo']);
        $libro->setAutor($data['autor']);
        $libro->setGenero($data['genero']);
        $libro->setAnioPublicacion($data['anioPublicacion']);
        $libro->setSinopsis($data['sinopsis']);

        $this->entityManager->persist($libro);
        $this->entityManager->flush();

        return $this->json([
            'id' => $libro->getId(),
            'titulo' => $libro->getTitulo(),
            'autor' => $libro->getAutor(),
            'genero' => $libro->getGenero(),
            'anioPublicacion' => $libro->getAnioPublicacion(),
            'sinopsis' => $libro->getSinopsis(),
        ], 201);
    }

    #[Route('/api/libro/{id}', name: 'update_libro', methods: ['PUT'])]
    public function updateLibro(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $libro = $this->libroRepository->find($id);

        if (!$libro) {
            throw new NotFoundHttpException('Libro no encontrado');
        }

        $libro->setTitulo($data['titulo']);
        $libro->setAutor($data['autor']);
        $libro->setGenero($data['genero']);
        $libro->setAnioPublicacion($data['anioPublicacion']);
        $libro->setSinopsis($data['sinopsis']);

        $this->entityManager->flush();

        return $this->json([
            'id' => $libro->getId(),
            'titulo' => $libro->getTitulo(),
            'autor' => $libro->getAutor(),
            'genero' => $libro->getGenero(),
            'anioPublicacion' => $libro->getAnioPublicacion(),
            'sinopsis' => $libro->getSinopsis(),
        ]);
    }

    #[Route('/api/libro/{id}', name: 'delete_libro', methods: ['DELETE'])]
    public function deleteLibro(int $id): JsonResponse
    {
        $libro = $this->libroRepository->find($id);

        if (!$libro) {
            throw new NotFoundHttpException('Libro no encontrado');
        }

        $this->entityManager->remove($libro);
        $this->entityManager->flush();

        return $this->json(['message' => 'Libro eliminado con éxito']);
    }
}
