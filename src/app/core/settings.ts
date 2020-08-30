export class Settings {
	show_quickstart: boolean;
	slideshow_speed_ms: number;
	starting_media_drawer_position: string;
	landing_page: string;
	navigate_left_1: string;
	navigate_left_2: string;
	navigate_right_1: string;
	navigate_right_2: string;
	start_stop_slideshow_1: string;
	start_stop_slideshow_2: string;
	open_media_drawer_1: string;
	open_media_drawer_2: string;

	constructor(settings?: Settings) {
		if (settings) this.duplicateFromExisting(settings);
	}

	private duplicateFromExisting(settings: Settings): void {
		for (let key in settings) {
			this[key] = settings[key];
		}
	}

	public fromTable(rows: object[]): Settings {
		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];

			this[row['setting']] = row['saved_value'];

			//convert to true boolean
			if (row['setting'] === 'show_quickstart') this.show_quickstart = (row['saved_value'] =="true");
		}

		return this;
	}
}
