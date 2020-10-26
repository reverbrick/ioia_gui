<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card" flat bordered v-model="kontakty" v-for="item in kontakty" :key="item.nazwisko">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{item.nazwisko}}</q-item-label>
          <q-item-label caption>
            {{item.stanowisko}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section horizontal>
        <q-card-section class="col-3">
          <q-icon size="sm" name="local_phone"/>
        </q-card-section>
        <q-separator vertical />
        <q-card-section class="col-9">
          {{item.telefon}}
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-section horizontal>
        <q-card-section class="col-3">
          <q-icon size="sm" name="email"/>
        </q-card-section>
        <q-separator vertical />
        <q-card-section class="col-9">
          <a :href="item.email">{{item.email}}</a><br/>
          <!--<a :href="item.email">{{item.email2}}</a>-->
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      kontakty: [
        { nazwisko: 'Budzińska Joanna', stanowisko: 'Koordynator/planista', telefon: '782 398 511', email: 'budzinska@metalwit.pl' },
        { nazwisko: 'Daniel Górny', stanowisko: 'Programista systemów', telefon: '517 451 563', email: 'dadmin.dgor@gmail.com' },
        { nazwisko: 'Jarmoła Adam', stanowisko: 'Specjalista od bezpieczeństwa', telefon: '796 785 347', email: 'yarmoua@gmail.com' },
        { nazwisko: 'Jurkiewicz Wojciech', stanowisko: 'Wsparcie konstrukcyjne', telefon: '730 366 087', email: 'jurkiewicz@metalwit.pl', email2: 'kontakt@wojciech-jurkiewicz.net' },
        { nazwisko: 'Kannenberg Tomasz', stanowisko: 'Konstruktor', telefon: '792 727 398', email: 'kannenberg@metalwit.pl', email2: 'introcad@wp.pl' },
        { nazwisko: 'Madej Michał', stanowisko: 'Automatyk/programista', telefon: '510 378 845', email: 'madej@metalwit.pl', email2: 'm.madej@hotmail.com' },
        { nazwisko: 'Nadolski Łukasz', stanowisko: 'Boss in Metalwit', telefon: '606 296 004', email: 'nadolski@metalwit.pl' },
        { nazwisko: 'Pasela Monika', stanowisko: 'Koordynator/wsparcie projektowe', telefon: '535 560 498', email: 'pasela@metalwit.pl' },
        { nazwisko: 'Reimann Krzysztof', stanowisko: 'Montażysta/automatyk', telefon: '534 121 202', email: 'k.reimann2@gmail.com' },
        { nazwisko: 'Wyrwicki Łukasz', stanowisko: 'Programista', telefon: '660 434 252', email: 'wyrwicki@metalwit.pl' }
      ]
    }
  }
}
</script>
