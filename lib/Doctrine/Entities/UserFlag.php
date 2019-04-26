<?php

namespace MailPoet\Doctrine\Entities;

/**
 * @Entity()
 * @Table(name="user_flags")
 */
class UserFlag {
  /**
   * @Column(type="integer")
   * @Id
   * @GeneratedValue
   * @var int|null
   */
  private $id;

  /**
   * @Column(type="integer")
   * @var int
   */
  private $user_id;

  /**
   * @Column(type="string")
   * @var string
   */
  private $name;

  /**
   * @Column(type="string")
   * @var string|null
   */
  private $value;
}
