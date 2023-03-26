import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'volk-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  @Input() domain: string;

  @Output() proceedToDeleteEvent = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<DeleteModalComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public domainData: string 
    ) { }

  ngOnInit(): void {
  }

  proceedToDelete() {
    this.dialogRef.close({event: 'delete'});
  }
}
