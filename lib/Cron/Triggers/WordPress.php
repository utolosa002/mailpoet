<?php
namespace MailPoet\Cron\Triggers;

use MailPoet\Cron\CronHelper;
use MailPoet\Cron\Workers\Scheduler as SchedulerWorker;
use MailPoet\Cron\Workers\SendingQueue\SendingQueue as SendingQueueWorker;
use MailPoet\Cron\Workers\Bounce as BounceWorker;
use MailPoet\Mailer\MailerLog;

if(!defined('ABSPATH')) exit;

class WordPress {
  static function run() {
    return (self::checkExecutionRequirements()) ?
      MailPoet::run() :
      self::cleanup();
  }

  static function checkExecutionRequirements() {
    $scheduled_queues = SchedulerWorker::getScheduledQueues();
    $running_queues = SendingQueueWorker::getRunningQueues();
    $sending_limit_reached = MailerLog::isSendingLimitReached();
    $bounce_sync_available = BounceWorker::checkBounceSyncAvailable();
    $bounce_due_queues = BounceWorker::getAllDueQueues();
    $bounce_future_queues = BounceWorker::getFutureQueues();
    return (($scheduled_queues || $running_queues) && !$sending_limit_reached)
      || ($bounce_sync_available && ($bounce_due_queues || !$bounce_future_queues));
  }

  static function cleanup() {
    $cron_daemon = CronHelper::getDaemon();
    if($cron_daemon) {
      CronHelper::deleteDaemon();
    }
  }
}