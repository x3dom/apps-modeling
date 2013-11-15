/* Die die andere Klasse erbt die Funktionselemente */
function ReflectFunction(extension, base)
{
   for ( var property in base )
   {
      try{ extension[property] = base[property]; }
      catch( warning ){}
   }
}
