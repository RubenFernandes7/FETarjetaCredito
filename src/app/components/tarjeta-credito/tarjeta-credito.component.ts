import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  listTarjetas: any[] = [];
  form: FormGroup;
  accion = 'Agregar';
  id: number | undefined;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private _tarjetaService: TarjetaService) { 
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaTarjeta: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    })
  }

  ngOnInit(): void {
    this.obtnerTarjetas();
  }

  obtnerTarjetas(){
    this._tarjetaService.getListTarjetas().subscribe((data: any) => {
      console.log(data);
      this.listTarjetas = data;
    }, error => {
      console.log(error);
    }
    )
  }

  guardarTarjeta(){
    const tarjeta: any = {
      titulo: this.form.get('titulo')?.value, 
      numeroTarjeta: this.form.get('numeroTarjeta')?.value, 
      fechaTarjeta: this.form.get('fechaTarjeta')?.value, 
      cvv: this.form.get('cvv')?.value, 
    }

    if(this.id == undefined)
    {

      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => {
        console.log(data);
        this.obtnerTarjetas();
        this.form.reset();
  
      }, error => {
        console.log(error);
      })
    }
    else{
        tarjeta.id = this.id;
        this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(data => {
          this.form.reset();
          this.accion = 'Agregar';
          this.id = undefined;
          this.obtnerTarjetas();
        })
    }

  }

  eliminarTarjeta(id: number){
    this._tarjetaService.deleteTarjeta(id).subscribe(data => {
      this.obtnerTarjetas();
    },
    error => {
      console.log(error);
    })
    // console.log(index);
  }

  editarTarjeta(tarjeta:any){
    this.accion = 'Editar';
    this.id = tarjeta.id;

    this.form.patchValue({
      titulo: tarjeta.titulo,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaTarjeta: tarjeta.fechaTarjeta,
      cvv: tarjeta.cvv
    })
  }

}
