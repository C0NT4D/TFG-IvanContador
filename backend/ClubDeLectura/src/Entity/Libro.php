<?php

namespace App\Entity;

use App\Repository\LibroRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
#[ORM\Entity(repositoryClass: LibroRepository::class)]
class Libro
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titulo = null;

    #[ORM\Column(length: 255)]
    private ?string $autor = null;

    #[ORM\Column(length: 255)]
    private ?string $genero = null;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $anioPublicacion = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $sinopsis = null;

    /**
     * @var Collection<int, Lectura>
     */
    #[ORM\OneToMany(targetEntity: Lectura::class, mappedBy: 'libro', cascade: ["remove"])]
    private Collection $lecturas;

    /**
     * @var Collection<int, Recomendacion>
     */
    #[ORM\OneToMany(targetEntity: Recomendacion::class, mappedBy: 'libro', cascade: ["remove"])]
    private Collection $recomendacions;

    public function __construct()
    {
        $this->lecturas = new ArrayCollection();
        $this->recomendacions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitulo(): ?string
    {
        return $this->titulo;
    }

    public function setTitulo(string $titulo): static
    {
        $this->titulo = $titulo;

        return $this;
    }

    public function getAutor(): ?string
    {
        return $this->autor;
    }

    public function setAutor(string $autor): static
    {
        $this->autor = $autor;

        return $this;
    }

    public function getGenero(): ?string
    {
        return $this->genero;
    }

    public function setGenero(string $genero): static
    {
        $this->genero = $genero;

        return $this;
    }

    public function getAnioPublicacion(): ?int
    {
        return $this->anioPublicacion;
    }

    public function setAnioPublicacion(int $anioPublicacion): static
    {
        $this->anioPublicacion = $anioPublicacion;

        return $this;
    }

    public function getSinopsis(): ?string
    {
        return $this->sinopsis;
    }

    public function setSinopsis(string $sinopsis): static
    {
        $this->sinopsis = $sinopsis;

        return $this;
    }

    /**
     * @return Collection<int, Lectura>
     */
    public function getLecturas(): Collection
    {
        return $this->lecturas;
    }

    public function addLectura(Lectura $lectura): static
    {
        if (!$this->lecturas->contains($lectura)) {
            $this->lecturas->add($lectura);
            $lectura->setLibro($this);
        }

        return $this;
    }

    public function removeLectura(Lectura $lectura): static
    {
        if ($this->lecturas->removeElement($lectura)) {
            // set the owning side to null (unless already changed)
            if ($lectura->getLibro() === $this) {
                $lectura->setLibro(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Recomendacion>
     */
    public function getRecomendacions(): Collection
    {
        return $this->recomendacions;
    }

    public function addRecomendacion(Recomendacion $recomendacion): static
    {
        if (!$this->recomendacions->contains($recomendacion)) {
            $this->recomendacions->add($recomendacion);
            $recomendacion->setLibro($this);
        }

        return $this;
    }

    public function removeRecomendacion(Recomendacion $recomendacion): static
    {
        if ($this->recomendacions->removeElement($recomendacion)) {
            // set the owning side to null (unless already changed)
            if ($recomendacion->getLibro() === $this) {
                $recomendacion->setLibro(null);
            }
        }

        return $this;
    }
}
