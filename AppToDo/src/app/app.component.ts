import { Component, OnInit } from '@angular/core'
import { Item } from './item'
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  //pode dar ruim
  logado = false
  tokenJWT = '{ "token":""}'
  //resto ta ok
  title = 'todo'
  filter: 'all' | 'active' | 'done' = 'all'
  allItems: any[] = []
  //pode dar errado
  letodosRegistros() {
    const idToken = new HttpHeaders().set(
      'id-token',
      JSON.parse(this.tokenJWT).token
    )
    this.http
      .get<Item[]>(`/api/getAll`, { headers: idToken })
      .subscribe(
        resultado => {
          this.allItems = resultado
          this.logado = true
        },
        error => {
          this.logado = false
        }
      )
  }
  ngOnInit(): void {
    this.letodosRegistros()
  }

  get items() {
    if (this.filter === 'all') {
      return this.allItems
    }
    return this.allItems.filter(item =>
      this.filter === 'done' ? item.done : !item.done
    )
  }

  addItem(description: string) {
    var produto = new Item()
    produto.description = description
    produto.done = false
    const idToken = new HttpHeaders().set(
      'id-token',
      JSON.parse(this.tokenJWT).token
    )
    this.http
      .post<Item>(`/api/post`, produto, { headers: idToken })
      .subscribe(
        resultado => {
          console.log(resultado)
          this.letodosRegistros()
        },
        error => {
          this.logado = false
        }
      )
  }

  updateItem(item) {
    const idToken = new HttpHeaders().set(
      'id-token',
      JSON.parse(this.tokenJWT).token
    )
    this.http
      .patch<Item>(`/api/update/${item._id}`, item, { headers: idToken })
      .subscribe(
        resultado => {
          console.log(resultado)
          this.letodosRegistros()
        },
        error => {
          this.logado = false
        }
      )
  }

  remove(item) {
    const idToken = new HttpHeaders().set(
      'id-token',
      JSON.parse(this.tokenJWT).token
    )
    this.http
      .delete<Item>(`/api/delete/${item._id}`, { headers: idToken })
      .subscribe(
        resultado => {
          console.log(resultado)
          this.letodosRegistros()
        },
        error => {
          this.logado = false
        }
      )
  }

  removeAllDone() {
    for (let index = this.allItems.length - 1; index >= 0; index--) {
      const element = this.allItems[index]
      if (element.done == true) {
        this.remove(element)
      }
    }
  }
  login(username: string, password: string) {
    var credenciais = { nome: username, senha: password }
    this.http.post(`/api/login`, credenciais).subscribe(resultado => {
      this.tokenJWT = JSON.stringify(resultado)
      this.letodosRegistros()
    })
  }
}
