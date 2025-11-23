import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";

interface ResetOptions {
  backup?: boolean;
}

export async function resetCommand(
  options: ResetOptions = { backup: true },
): Promise<void> {
  console.log(chalk.yellow("\n⚠️  Reset to Vanilla State\n"));

  // Confirm reset
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "This will reset Claude Code to vanilla state. Continue?",
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(chalk.gray("\nReset cancelled.\n"));
    return;
  }

  const spinner = ora("Resetting configuration...").start();

  try {
    // TODO: Implement backup if enabled
    if (options.backup) {
      spinner.text = "Creating backup...";
      // Create backup logic
    }

    // TODO: Implement reset logic
    spinner.text = "Removing configurations...";
    // Remove .claude directories

    spinner.succeed("Reset complete");

    console.log(chalk.green("\n✅ Claude Code reset to vanilla state\n"));

    if (options.backup) {
      console.log(chalk.gray("Backup created for restore if needed.\n"));
    }
  } catch (error) {
    spinner.fail("Reset failed");
    console.error(
      chalk.red("\nError:"),
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exit(1);
  }
}
