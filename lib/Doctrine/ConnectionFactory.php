<?php

namespace MailPoet\Doctrine;

use MailPoet\Config\Env;
use MailPoetVendor\Doctrine\DBAL\Configuration;
use MailPoetVendor\Doctrine\DBAL\Connection;
use MailPoetVendor\Doctrine\DBAL\DriverManager;
use MailPoetVendor\Doctrine\DBAL\Platforms\MySqlPlatform;
use PDO;

class ConnectionFactory {
  const DRIVER = 'pdo_mysql';
  const PLATFORM_CLASS = MySqlPlatform::class;

  public $driver_option_wait_timeout = 60;

  function createConnection() {
    $platform_class = self::PLATFORM_CLASS;
    $connection_params = [
      'driver' => self::DRIVER,
      'platform' => new $platform_class,
      'host' => Env::$db_host,
      'port' => Env::$db_port,
      'socket' => Env::$db_socket,
      'user' => Env::$db_username,
      'password' => Env::$db_password,
      'charset' => Env::$db_charset,
      'dbname' => Env::$db_name,
      'driverOptions' => $this->getDriverOptions(Env::$db_timezone_offset, Env::$db_charset, Env::$db_collation),
    ];

    $configuration = new Configuration();
    $connection = DriverManager::getConnection($connection_params, $configuration);
    $this->setWaitTimeout($connection);
    return $connection;
  }

  private function setWaitTimeout(Connection $connection) {
    try {
      $current_options = $connection->executeQuery('SELECT @@session.wait_timeout as wait_timeout')->fetch();
      if ($current_options && (int)$current_options['wait_timeout'] < $this->driver_option_wait_timeout) {
        $connection->executeUpdate(
          'SET SESSION wait_timeout = ?',
          [$this->driver_option_wait_timeout],
          [PDO::PARAM_INT]
        );
      }
    } catch (\PDOException $e) {
      // rethrow PDOExceptions to prevent exposing sensitive data in stack traces
      throw new \Exception($e->getMessage());
    }
  }

  private function getDriverOptions($timezone_offset, $charset, $collation) {
    $driver_options = [
      "TIME_ZONE = \"$timezone_offset\"",
      'sql_mode=(SELECT REPLACE(@@sql_mode,"ONLY_FULL_GROUP_BY",""))',
    ];

    if (!empty(Env::$db_charset)) {
      $driver_options[] = "NAMES $charset" . (empty($collation) ? '' : " COLLATE $collation");
    }

    return [
      PDO::MYSQL_ATTR_INIT_COMMAND => 'SET ' . implode(', ', $driver_options),
    ];
  }
}
