const { MigrationInterface, QueryRunner } = require('typeorm');

class AddUser1621225487969 {
  async up(queryRunner) {
    // Yapısal değişiklikleri burada yapın
    await queryRunner.queryRunner('CREATE TABLE "User" ("user_id" SERIAL')
  }

  async down(queryRunner) {
    // Geri alma işlemlerini burada yapın
    await queryRunner.queryRunner('DRO TABLE User')
  }
}

module.exports = AddUser1621225487969;
