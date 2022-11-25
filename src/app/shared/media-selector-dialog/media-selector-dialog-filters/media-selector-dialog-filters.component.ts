import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";

@Component({
	selector: 'isvr-media-selector-dialog-filters',
	templateUrl: './media-selector-dialog-filters.component.html',
	styleUrls: ['./media-selector-dialog-filters.component.scss']
})
export class MediaSelectorDialogFiltersComponent implements OnInit {
	@Output() onFilterChanged = new EventEmitter<string>();

	public searchTerm: string;
	public searchControl: FormControl = new FormControl();

	constructor() {
		this.resetFilters();
	}

	ngOnInit() {
		this.setupSearchInput();
	}

	private setupSearchInput(): void {
		this.searchControl.valueChanges.pipe(
			debounceTime(500)
		).subscribe(this.filterBySearch);
	}

	private filterBySearch = (newTerm: string): void => {
		this.searchTerm = newTerm;
		this.filtersChanged();
	}

	public filtersChanged(): void {
		this.onFilterChanged.emit(this.searchTerm);
	}

	public clearTerm(): void {
		this.searchTerm = '';

		this.searchControl.setValue(this.searchTerm);
		this.filtersChanged();
	}

	public resetFilters(): void {
		this.searchTerm = '';
		this.filtersChanged();
	}}