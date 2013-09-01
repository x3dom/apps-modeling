/*
 * Inherits the properties and methods of an object on another
 */
function SnapInherits(base, extension)
{
   for ( var property in base )
   {
      try
      {
         extension[property] = base[property];
      }
      catch( warning ){}
   }
}