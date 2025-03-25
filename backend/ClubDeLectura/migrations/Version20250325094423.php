<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250325094423 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE evento (id INT AUTO_INCREMENT NOT NULL, organizador_id INT DEFAULT NULL, titulo VARCHAR(255) NOT NULL, descripcion LONGTEXT NOT NULL, fecha DATETIME NOT NULL, ubicacion VARCHAR(255) NOT NULL, INDEX IDX_47860B05E3445778 (organizador_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE foro (id INT AUTO_INCREMENT NOT NULL, admin_id INT DEFAULT NULL, titulo VARCHAR(255) NOT NULL, descripcion LONGTEXT NOT NULL, fecha_creacion DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_BC869C63642B8210 (admin_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inscripcion (id INT AUTO_INCREMENT NOT NULL, evento_id INT DEFAULT NULL, usuario_id INT DEFAULT NULL, fecha_inscripcion DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_935E99F087A5F842 (evento_id), INDEX IDX_935E99F0DB38439E (usuario_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE lectura (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, libro_id INT DEFAULT NULL, estado_lectura VARCHAR(255) NOT NULL, fecha_inicio DATE NOT NULL, fecha_fin DATE NOT NULL, INDEX IDX_C60ABD51DB38439E (usuario_id), INDEX IDX_C60ABD51C0238522 (libro_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE libro (id INT AUTO_INCREMENT NOT NULL, titulo VARCHAR(255) NOT NULL, autor VARCHAR(255) NOT NULL, genero VARCHAR(255) NOT NULL, anio_publicacion SMALLINT NOT NULL, sinopsis LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE mensaje (id INT AUTO_INCREMENT NOT NULL, foro_id INT DEFAULT NULL, usuario_id INT DEFAULT NULL, contenido LONGTEXT NOT NULL, fecha_envio DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_9B631D01F5FF53F6 (foro_id), INDEX IDX_9B631D01DB38439E (usuario_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE recomendacion (id INT AUTO_INCREMENT NOT NULL, usuario_id INT DEFAULT NULL, libro_id INT DEFAULT NULL, comentario LONGTEXT NOT NULL, fecha DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_739444C1DB38439E (usuario_id), INDEX IDX_739444C1C0238522 (libro_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE usuario (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, contrasena VARCHAR(255) NOT NULL, rol VARCHAR(255) NOT NULL, fecha_registro DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE evento ADD CONSTRAINT FK_47860B05E3445778 FOREIGN KEY (organizador_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE foro ADD CONSTRAINT FK_BC869C63642B8210 FOREIGN KEY (admin_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE inscripcion ADD CONSTRAINT FK_935E99F087A5F842 FOREIGN KEY (evento_id) REFERENCES evento (id)');
        $this->addSql('ALTER TABLE inscripcion ADD CONSTRAINT FK_935E99F0DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE lectura ADD CONSTRAINT FK_C60ABD51DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE lectura ADD CONSTRAINT FK_C60ABD51C0238522 FOREIGN KEY (libro_id) REFERENCES libro (id)');
        $this->addSql('ALTER TABLE mensaje ADD CONSTRAINT FK_9B631D01F5FF53F6 FOREIGN KEY (foro_id) REFERENCES foro (id)');
        $this->addSql('ALTER TABLE mensaje ADD CONSTRAINT FK_9B631D01DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE recomendacion ADD CONSTRAINT FK_739444C1DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE recomendacion ADD CONSTRAINT FK_739444C1C0238522 FOREIGN KEY (libro_id) REFERENCES libro (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE evento DROP FOREIGN KEY FK_47860B05E3445778');
        $this->addSql('ALTER TABLE foro DROP FOREIGN KEY FK_BC869C63642B8210');
        $this->addSql('ALTER TABLE inscripcion DROP FOREIGN KEY FK_935E99F087A5F842');
        $this->addSql('ALTER TABLE inscripcion DROP FOREIGN KEY FK_935E99F0DB38439E');
        $this->addSql('ALTER TABLE lectura DROP FOREIGN KEY FK_C60ABD51DB38439E');
        $this->addSql('ALTER TABLE lectura DROP FOREIGN KEY FK_C60ABD51C0238522');
        $this->addSql('ALTER TABLE mensaje DROP FOREIGN KEY FK_9B631D01F5FF53F6');
        $this->addSql('ALTER TABLE mensaje DROP FOREIGN KEY FK_9B631D01DB38439E');
        $this->addSql('ALTER TABLE recomendacion DROP FOREIGN KEY FK_739444C1DB38439E');
        $this->addSql('ALTER TABLE recomendacion DROP FOREIGN KEY FK_739444C1C0238522');
        $this->addSql('DROP TABLE evento');
        $this->addSql('DROP TABLE foro');
        $this->addSql('DROP TABLE inscripcion');
        $this->addSql('DROP TABLE lectura');
        $this->addSql('DROP TABLE libro');
        $this->addSql('DROP TABLE mensaje');
        $this->addSql('DROP TABLE recomendacion');
        $this->addSql('DROP TABLE usuario');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
