import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/services/project/project.service';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
  topbarVisible: boolean;
  titleInputLimit: number = 30;
  titleInputCharacters: number = 0;
  descriptionInputLimit: number = 200;
  descriptionInputCharacters: number = 0;


  constructor(

    public projectService: ProjectService
  ) {
    this.projectForm.controls.title.valueChanges.subscribe((value) => {
      this.titleInputCharacters = value.length;
      if (value.length > this.titleInputLimit) {
        this.sliceInput('title', this.titleInputLimit)
      }
    })

    this.projectForm.controls.description.valueChanges.subscribe((value) => {
      this.descriptionInputCharacters = value.length;
      if (value.length > this.descriptionInputLimit) {
        this.sliceInput('description', this.descriptionInputLimit)
      }
    })

  }

  ngOnInit(): void {
    this.projectService.showDialog.subscribe((value) => {
      this.topbarVisible = value;
    })
  }

  projectForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(this.titleInputLimit)
      ]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(this.descriptionInputLimit)
      ]
    }),
  })

  sliceInput(controlName: string, inputLimit: number) {
    let formControl = this.projectForm.get(controlName);
    let inputValue = formControl.value;
    let newInputValue = inputValue.slice(0, inputLimit)

    formControl.patchValue(newInputValue)
  }

  submitForm() {
    this.projectService.showDialog.next(false);
    this.projectService.createNewProject(this.projectForm.value);
    this.projectForm.reset()

  }
}
