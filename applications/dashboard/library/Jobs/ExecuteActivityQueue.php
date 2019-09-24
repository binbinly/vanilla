<?php
/**
 * @copyright 2009-2019 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

use Vanilla\Scheduler\Job\JobExecutionStatus;
use Vanilla\Scheduler\Job\JobPriority;

/**
 * Execute the activity queue.
 */
class ExecuteActivityQueue implements Vanilla\Scheduler\Job\LocalJobInterface {

    /**
     * Execute all queued up items in the ActivityModel queue.
     */
    public function run(): JobExecutionStatus {
        /** @var \ActivityModel $activityModel */
        $activityModel = \Gdn::getContainer()->get(\ActivityModel::class);
        $activityModel->saveQueue();
        return JobExecutionStatus::complete();
    }

    /**
     * Set job Message
     *
     * @param array $message
     */
    public function setMessage(array $message) {
    }

    /**
     * Set job priority
     *
     * @param JobPriority $priority
     * @return void
     */
    public function setPriority(JobPriority $priority) {
    }

    /**
     * Set job execution delay
     *
     * @param int $seconds
     * @return void
     */
    public function setDelay(int $seconds) {
    }
}
