import { Component, OnInit,NgModule } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';
import * as $ from 'jquery';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})


export class EmployeeComponent implements OnInit {
  dataSaved = false;
  employeeForm: any;
  allEmployees: Observable<Employee[]>;
  employeeIdUpdate = null;
  massage = null;
  selected12:string;
  Role:string;

  selectedStatus: string;
  status: string[] = ['Yes', 'No'];


 
  constructor(private formbulider: FormBuilder, private employeeService: EmployeeService) {

   }

  ngOnInit() {
    this.employeeForm = this.formbulider.group({
      EmpName: ['', [Validators.required]],
      DateOfBirth: ['', [Validators.required]],
      IsActive: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      Role: [''],
      DateOfJoin: ['', [Validators.required]],
      Dept: ['', [Validators.required]],
      Skills: ['', [Validators.required]],
    });



    this.selectedStatus="No";



    this.loadAllEmployees();
    //this.selected="";
  }
  loadAllEmployees() {
    this.allEmployees = this.employeeService.getAllEmployee();
  }
  onFormSubmit() {

    debugger;
    this.dataSaved = false;
    const employee = this.employeeForm.value;

     this.selected12= $('#ddrole').val().toString();

    employee.Role=this.selected12;
    

    if(this.selectedStatus=="Yes")
    {
     employee.IsActive=true;
    }
    else
    {
      employee.IsActive=false;
    }

    this.CreateEmployee(employee);
    this.employeeForm.reset();
  }
  loadEmployeeToEdit(employeeId: string) {
    this.employeeService.getEmployeeById(employeeId).subscribe(employee => {
debugger;

      this.massage = null;
      this.dataSaved = false;
      this.employeeIdUpdate = employee.EmpId;
      this.employeeForm.controls['EmpName'].setValue(employee.EmpName);
      this.employeeForm.controls['DateOfBirth'].setValue(employee.DateOfBirth);
      this.employeeForm.controls['IsActive'].setValue(employee.IsActive);
      this.employeeForm.controls['Address'].setValue(employee.Address);
      this.employeeForm.controls['Role'].setValue(employee.Role);
      this.employeeForm.controls['DateOfJoin'].setValue(employee.DateOfJoin);
      this.employeeForm.controls['Dept'].setValue(employee.Dept);
      this.employeeForm.controls['Skills'].setValue(employee.Skills);

      debugger;

      $('#ddrole').val(employee.Role);
      this.Role= employee.Role;
     

      if(employee.IsActive==true)
      {
        this.selectedStatus="Yes";
       
      }
      else
      {
        this.selectedStatus="No";
      }
      //this.selected12= employee.Role;


    });

  }
  CreateEmployee(employee: Employee) {

    debugger;
    if (this.employeeIdUpdate == null) {
      this.employeeService.createEmployee(employee).subscribe(
        () => {
          this.dataSaved = true;
          this.massage = 'Record saved Successfully';
          this.loadAllEmployees();
          this.employeeIdUpdate = null;
          this.employeeForm.reset();
        }
      );
    } else {

      debugger;
      employee.EmpId = this.employeeIdUpdate;
      this.employeeService.updateEmployee(employee).subscribe(() => {
        this.dataSaved = true;
        this.massage = 'Record Updated Successfully';
        this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.employeeForm.reset();
      });
    }
  }
 
  deleteEmployee(employeeId: string) {
    if (confirm("Are you sure you want to delete this ?")) {  
    this.employeeService.deleteEmployeeById(employeeId).subscribe(() => {
      this.dataSaved = true;
      this.massage = 'Record Deleted Succefully';
      this.loadAllEmployees();
      this.employeeIdUpdate = null;
      this.employeeForm.reset();

    });
  }
}
  resetForm() {
    this.employeeForm.reset();
    this.massage = null;
    this.dataSaved = false;
  }
}
