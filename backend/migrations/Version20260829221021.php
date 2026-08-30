<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260829221021 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE defect (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(255) NOT NULL, severity VARCHAR(255) NOT NULL, description VARCHAR(500) DEFAULT NULL, die_row INT NOT NULL, die_col INT NOT NULL, detected_at DATETIME NOT NULL, wafer_id INT NOT NULL, INDEX IDX_3A9C3887393F60FE (wafer_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE lot (id INT AUTO_INCREMENT NOT NULL, lot_number VARCHAR(255) NOT NULL, status VARCHAR(255) NOT NULL, wafer_count INT NOT NULL, started_at DATETIME NOT NULL, completed_at DATETIME DEFAULT NULL, product VARCHAR(255) NOT NULL, created_by VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_B81291B715E7A3E (lot_number), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE lot_history (id INT AUTO_INCREMENT NOT NULL, from_status VARCHAR(50) NOT NULL, to_status VARCHAR(50) NOT NULL, changed_by_email VARCHAR(180) NOT NULL, changed_at DATETIME NOT NULL, note VARCHAR(500) DEFAULT NULL, lot_id INT NOT NULL, INDEX IDX_8A3A3668A8CBA5F7 (lot_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, name VARCHAR(100) NOT NULL, password VARCHAR(255) NOT NULL, roles JSON NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE wafer (id INT AUTO_INCREMENT NOT NULL, serial_number VARCHAR(100) NOT NULL, position INT NOT NULL, status VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, lot_id INT NOT NULL, UNIQUE INDEX UNIQ_E49163C4D948EE2 (serial_number), INDEX IDX_E49163C4A8CBA5F7 (lot_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE defect ADD CONSTRAINT FK_3A9C3887393F60FE FOREIGN KEY (wafer_id) REFERENCES wafer (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE lot_history ADD CONSTRAINT FK_8A3A3668A8CBA5F7 FOREIGN KEY (lot_id) REFERENCES lot (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE wafer ADD CONSTRAINT FK_E49163C4A8CBA5F7 FOREIGN KEY (lot_id) REFERENCES lot (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE defect DROP FOREIGN KEY FK_3A9C3887393F60FE');
        $this->addSql('ALTER TABLE lot_history DROP FOREIGN KEY FK_8A3A3668A8CBA5F7');
        $this->addSql('ALTER TABLE wafer DROP FOREIGN KEY FK_E49163C4A8CBA5F7');
        $this->addSql('DROP TABLE defect');
        $this->addSql('DROP TABLE lot');
        $this->addSql('DROP TABLE lot_history');
        $this->addSql('DROP TABLE `user`');
        $this->addSql('DROP TABLE wafer');
    }
}
